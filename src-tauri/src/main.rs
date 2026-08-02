// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tracing::{error, info};

pub mod drafts;
pub mod error;
pub mod file_explorer;
pub mod interfaces;

use crate::drafts::{Draft, DraftMeta};
use crate::error::AppResult;
use crate::interfaces::SystemObject;

/// List the contents of a directory.
/// Returns children plus a trailing entry for the directory itself
/// (legacy contract — see `interfaces::SystemObject`).
#[tauri::command]
async fn read_directory(path: String) -> AppResult<Vec<SystemObject>> {
    file_explorer::list_directory(&path).inspect_err(|e| log_cmd_err("read_directory", &path, e))
}

/// Read a UTF-8 text file. Rejects oversized or binary files.
#[tauri::command]
async fn read_file(path: String) -> AppResult<String> {
    file_explorer::read_text_file(&path).inspect_err(|e| log_cmd_err("read_file", &path, e))
}

/// Persist `data` to `path` (truncates existing files).
#[tauri::command]
async fn save_file(path: String, data: String) -> AppResult<()> {
    file_explorer::write_text_file(&path, &data).inspect_err(|e| log_cmd_err("save_file", &path, e))
}

// ---------------------------------------------------------------------------
// Draft commands
// ---------------------------------------------------------------------------

#[tauri::command]
async fn list_drafts(app: tauri::AppHandle) -> AppResult<Vec<DraftMeta>> {
    drafts::list(&app).inspect_err(|e| log_cmd_err("list_drafts", "-", e))
}

#[tauri::command]
async fn read_draft(app: tauri::AppHandle, id: String) -> AppResult<Draft> {
    drafts::read(&app, &id).inspect_err(|e| log_cmd_err("read_draft", &id, e))
}

#[tauri::command]
async fn save_draft(app: tauri::AppHandle, draft: Draft) -> AppResult<()> {
    let id = draft.id.clone();
    drafts::save(&app, draft).inspect_err(|e| log_cmd_err("save_draft", &id, e))
}

#[tauri::command]
async fn delete_draft(app: tauri::AppHandle, id: String) -> AppResult<()> {
    drafts::delete(&app, &id).inspect_err(|e| log_cmd_err("delete_draft", &id, e))
}

fn log_cmd_err(op: &str, path: &str, err: &error::AppError) {
    error!(target: "tauri::cmd", op = op, path = path, "{err}");
}

fn init_tracing() -> Option<tracing_appender::non_blocking::WorkerGuard> {
    use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

    let filter = EnvFilter::try_from_env("RUSTY_LOG")
        .unwrap_or_else(|_| EnvFilter::new("info,rusty=debug"));
    let console_layer = fmt::layer().with_target(true);

    // Production builds also write daily-rotated logs under the user's
    // local-data dir (`<data_local>/rusty-notepad/logs/`). The returned
    // guard must outlive `main`, so we hand it back to the caller.
    if cfg!(debug_assertions) {
        let _ = tracing_subscriber::registry()
            .with(filter)
            .with(console_layer)
            .try_init();
        return None;
    }

    if let Some(dir) = log_dir() {
        if std::fs::create_dir_all(&dir).is_ok() {
            let appender = tracing_appender::rolling::daily(&dir, "rusty.log");
            let (writer, guard) = tracing_appender::non_blocking(appender);
            let file_layer = fmt::layer().with_writer(writer).with_ansi(false);
            let _ = tracing_subscriber::registry()
                .with(filter)
                .with(console_layer)
                .with(file_layer)
                .try_init();
            return Some(guard);
        }
    }

    let _ = tracing_subscriber::registry()
        .with(filter)
        .with(console_layer)
        .try_init();
    None
}

fn log_dir() -> Option<std::path::PathBuf> {
    directories::ProjectDirs::from("com", "rusty", "notepad")
        .map(|p| p.data_local_dir().join("logs"))
}

fn main() {
    let _tracing_guard = init_tracing();
    info!("starting rusty-notepad");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_directory,
            read_file,
            save_file,
            list_drafts,
            read_draft,
            save_draft,
            delete_draft
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
