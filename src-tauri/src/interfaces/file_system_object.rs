//! Wire-level DTOs shared with the frontend.

use serde::{Deserialize, Serialize};

/// A single entry produced by `read_directory`.
///
/// The legacy contract appends the *root* directory as the last element
/// of the returned `Vec`; consumers must pop it before rendering
/// children. A typed `DirectoryListing` replacement is tracked in
/// `plan/PROGRESS.md` (workstream D).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemObject {
    pub file_name: String,
    pub is_folder: bool,
    pub err: Option<String>,
}

impl SystemObject {
    pub fn file(name: impl Into<String>) -> Self {
        Self { file_name: name.into(), is_folder: false, err: None }
    }

    pub fn folder(name: impl Into<String>) -> Self {
        Self { file_name: name.into(), is_folder: true, err: None }
    }
}

