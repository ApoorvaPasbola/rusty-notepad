//! File-system operations exposed to the Tauri command layer.
//!
//! All functions in this module return `AppResult<T>` and never panic on
//! user input. Path handling is centralised in `resolve_path` so callers
//! get a single, consistent set of errors.

use std::{
    env, fs,
    path::{Path, PathBuf},
};

use tracing::{debug, warn};

use crate::error::{AppError, AppResult};
use crate::interfaces::SystemObject;

/// Hard cap on file size we are willing to load into the editor (8 MiB).
/// Beyond this Quill performance degrades and the file is more likely to
/// be binary anyway. Tunable via `RUSTY_MAX_FILE_BYTES` env var.
const DEFAULT_MAX_FILE_BYTES: u64 = 8 * 1024 * 1024;

/// Reads `path` (relative paths are resolved against the process cwd) and
/// returns its direct children plus a trailing entry for the directory
/// itself — preserving the legacy contract the frontend relies on.
pub fn list_directory(path: &str) -> AppResult<Vec<SystemObject>> {
    let abs_path = resolve_path(path)?;

    if !abs_path.is_dir() {
        return Err(AppError::Invalid(format!(
            "{} is not a directory",
            abs_path.display()
        )));
    }

    let mut entries = collect_entries(&abs_path)?;
    sort_entries(&mut entries);

    let root_name = abs_path
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or("workpad")
        .to_string();
    entries.push(SystemObject::folder(root_name));

    debug!(target: "file_explorer", "listed {} entries under {}", entries.len() - 1, abs_path.display());
    Ok(entries)
}

/// Reads the textual content of a file. Refuses files larger than
/// `max_bytes()` and surfaces a typed error for missing / permission
/// issues so the UI can react meaningfully.
pub fn read_text_file(path: &str) -> AppResult<String> {
    let abs_path = resolve_path(path)?;

    let metadata = fs::metadata(&abs_path)?;
    if !metadata.is_file() {
        return Err(AppError::Invalid(format!(
            "{} is not a regular file",
            abs_path.display()
        )));
    }

    let limit = max_bytes();
    if metadata.len() > limit {
        return Err(AppError::Invalid(format!(
            "file too large: {} bytes (limit {} bytes)",
            metadata.len(),
            limit
        )));
    }

    let bytes = fs::read(&abs_path)?;
    if looks_binary(&bytes) {
        return Err(AppError::Invalid(format!(
            "{} appears to be binary",
            abs_path.display()
        )));
    }

    String::from_utf8(bytes).map_err(|e| AppError::Invalid(e.to_string()))
}

/// Writes `data` to `path`, creating the file if missing and truncating
/// otherwise. Parent directories must already exist.
pub fn write_text_file(path: &str, data: &str) -> AppResult<()> {
    let abs_path = resolve_path(path)?;

    if let Some(parent) = abs_path.parent() {
        if !parent.as_os_str().is_empty() && !parent.exists() {
            return Err(AppError::NotFound(format!(
                "parent directory does not exist: {}",
                parent.display()
            )));
        }
    }

    fs::write(&abs_path, data)?;
    debug!(target: "file_explorer", "wrote {} bytes to {}", data.len(), abs_path.display());
    Ok(())
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

fn resolve_path(raw: &str) -> AppResult<PathBuf> {
    if raw.trim().is_empty() {
        return Err(AppError::Invalid("path is empty".into()));
    }

    let candidate = if raw.starts_with('.') {
        env::current_dir()
            .map_err(AppError::from)?
            .join(raw.trim_start_matches('.').trim_start_matches(['/', '\\']))
    } else {
        PathBuf::from(raw)
    };

    Ok(candidate)
}

fn collect_entries(dir: &Path) -> AppResult<Vec<SystemObject>> {
    let mut out = Vec::new();
    for entry_result in fs::read_dir(dir)? {
        let entry = match entry_result {
            Ok(e) => e,
            Err(e) => {
                warn!(target: "file_explorer", "skip unreadable entry: {}", e);
                continue;
            }
        };

        let file_name = entry.file_name().to_string_lossy().into_owned();
        let is_folder = entry.file_type().map(|ft| ft.is_dir()).unwrap_or(false);

        out.push(SystemObject {
            file_name,
            is_folder,
            err: None,
        });
    }
    Ok(out)
}

/// Folders first, then files; both alphabetical case-insensitive.
fn sort_entries(entries: &mut [SystemObject]) {
    entries.sort_by(|a, b| match (a.is_folder, b.is_folder) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.file_name.to_lowercase().cmp(&b.file_name.to_lowercase()),
    });
}

/// Heuristic binary sniff: any NUL byte in the first 8 KiB.
fn looks_binary(bytes: &[u8]) -> bool {
    bytes.iter().take(8 * 1024).any(|&b| b == 0)
}

fn max_bytes() -> u64 {
    env::var("RUSTY_MAX_FILE_BYTES")
        .ok()
        .and_then(|s| s.parse().ok())
        .unwrap_or(DEFAULT_MAX_FILE_BYTES)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sort_puts_folders_first_then_alpha() {
        let mut v = vec![
            SystemObject::file("b.txt"),
            SystemObject::folder("Zeta"),
            SystemObject::file("a.txt"),
            SystemObject::folder("alpha"),
        ];
        sort_entries(&mut v);
        let names: Vec<_> = v.iter().map(|e| e.file_name.as_str()).collect();
        assert_eq!(names, vec!["alpha", "Zeta", "a.txt", "b.txt"]);
    }

    #[test]
    fn binary_sniff_detects_nul_byte() {
        assert!(looks_binary(b"hello\0world"));
        assert!(!looks_binary(b"hello world"));
    }

    #[test]
    fn empty_path_is_rejected() {
        assert!(matches!(resolve_path("   "), Err(AppError::Invalid(_))));
    }
}
