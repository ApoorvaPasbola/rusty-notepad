// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, path::PathBuf};

use file_explorer::SystemObject;
pub mod file_explorer;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn read_directory(path: String) -> Vec<SystemObject> {
    let mut vec = Vec::new();
    let asb_path: PathBuf;

    if path.starts_with(".") {
        asb_path = match env::current_dir() {
            Ok(p) => p,
            Err(_err) => PathBuf::from("undefined"),
        }
    } else {
        asb_path = PathBuf::from(path);
    }

    let _ = file_explorer::_list_files(&mut vec, &asb_path);
    vec
}

#[tauri::command]
async fn read_file(path: String) -> String {
    file_explorer::_read_file(path)
}

#[tauri::command]
async fn save_file(path: String, data: String) -> String {
    let save_file_result = file_explorer::save_file(&path, data);
    match save_file_result {
        Ok(()) => String::from("Saved File successfully"),
        Err(e) => String::from(e.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_directory,
            read_file,
            save_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
