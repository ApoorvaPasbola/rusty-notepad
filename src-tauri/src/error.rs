//! Application-wide error type.
//!
//! Every `#[tauri::command]` returns `AppResult<T>`. `AppError` is
//! `Serialize` so Tauri rejects the JS promise with a structured payload
//! that the frontend can pattern-match on `kind`.

use serde::Serialize;
use std::io;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
#[serde(tag = "kind", content = "message")]
pub enum AppError {
    #[error("not found: {0}")]
    NotFound(String),

    #[error("permission denied: {0}")]
    PermissionDenied(String),

    #[error("invalid input: {0}")]
    Invalid(String),

    #[error("io error: {0}")]
    Io(String),
}

pub type AppResult<T> = Result<T, AppError>;

impl From<io::Error> for AppError {
    fn from(err: io::Error) -> Self {
        match err.kind() {
            io::ErrorKind::NotFound => AppError::NotFound(err.to_string()),
            io::ErrorKind::PermissionDenied => AppError::PermissionDenied(err.to_string()),
            io::ErrorKind::InvalidInput | io::ErrorKind::InvalidData => {
                AppError::Invalid(err.to_string())
            }
            _ => AppError::Io(err.to_string()),
        }
    }
}

