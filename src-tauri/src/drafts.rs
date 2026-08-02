//! Persistent draft storage under `app_local_data_dir/drafts/`.
//!
//! Each draft is one JSON file named `<uuid>.json`. The id is validated
//! as a UUID on every call to prevent path traversal — the only way to
//! reach a file outside the drafts directory is to supply a non-UUID id,
//! which we reject.

use std::{
    fs,
    path::PathBuf,
    time::{SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tracing::{debug, warn};
use uuid::Uuid;

use crate::error::{AppError, AppResult};

const DRAFTS_DIR: &str = "drafts";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum DraftFormat {
    Delta,
    Text,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Draft {
    pub id: String,
    pub title: String,
    pub content: String,
    pub format: DraftFormat,
    #[serde(default)]
    pub original_path: Option<String>,
    pub updated_at_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DraftMeta {
    pub id: String,
    pub title: String,
    #[serde(default)]
    pub original_path: Option<String>,
    pub updated_at_ms: u64,
}

// ---------------------------------------------------------------------------
// public API (called from main.rs Tauri commands)
// ---------------------------------------------------------------------------

pub fn list(app: &AppHandle) -> AppResult<Vec<DraftMeta>> {
    let dir = ensure_dir(app)?;
    let mut out = Vec::new();

    for entry_result in fs::read_dir(&dir)? {
        let entry = match entry_result {
            Ok(e) => e,
            Err(e) => {
                warn!(target: "drafts", "skip unreadable draft entry: {e}");
                continue;
            }
        };
        let path = entry.path();
        if path.extension().and_then(|s| s.to_str()) != Some("json") {
            continue;
        }
        match read_payload(&path) {
            Ok(d) => out.push(DraftMeta {
                id: d.id,
                title: d.title,
                original_path: d.original_path,
                updated_at_ms: d.updated_at_ms,
            }),
            Err(e) => warn!(target: "drafts", path = %path.display(), "skip corrupt draft: {e}"),
        }
    }

    out.sort_by(|a, b| b.updated_at_ms.cmp(&a.updated_at_ms));
    debug!(target: "drafts", count = out.len(), "listed drafts");
    Ok(out)
}

pub fn read(app: &AppHandle, id: &str) -> AppResult<Draft> {
    read_payload(&draft_path(app, id)?)
}

pub fn save(app: &AppHandle, mut draft: Draft) -> AppResult<()> {
    validate_id(&draft.id)?;
    if draft.updated_at_ms == 0 {
        draft.updated_at_ms = now_ms();
    }
    let path = draft_path(app, &draft.id)?;
    let json = serde_json::to_string(&draft).map_err(|e| AppError::Invalid(e.to_string()))?;
    fs::write(&path, json)?;
    debug!(target: "drafts", id = %draft.id, "saved draft");
    Ok(())
}

pub fn delete(app: &AppHandle, id: &str) -> AppResult<()> {
    let path = draft_path(app, id)?;
    match fs::remove_file(&path) {
        Ok(()) => {
            debug!(target: "drafts", id = id, "deleted draft");
            Ok(())
        }
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(e) => Err(e.into()),
    }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

fn read_payload(path: &PathBuf) -> AppResult<Draft> {
    let bytes = fs::read(path)?;
    serde_json::from_slice(&bytes).map_err(|e| AppError::Invalid(e.to_string()))
}

fn draft_path(app: &AppHandle, id: &str) -> AppResult<PathBuf> {
    validate_id(id)?;
    Ok(ensure_dir(app)?.join(format!("{id}.json")))
}

fn validate_id(id: &str) -> AppResult<()> {
    Uuid::parse_str(id)
        .map(|_| ())
        .map_err(|_| AppError::Invalid(format!("invalid draft id: {id}")))
}

fn ensure_dir(app: &AppHandle) -> AppResult<PathBuf> {
    let base = app
        .path_resolver()
        .app_local_data_dir()
        .ok_or_else(|| AppError::Io("cannot resolve app data dir".into()))?;
    let dir = base.join(DRAFTS_DIR);
    if !dir.exists() {
        fs::create_dir_all(&dir)?;
    }
    Ok(dir)
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_non_uuid_id() {
        assert!(matches!(validate_id("../etc/passwd"), Err(AppError::Invalid(_))));
        assert!(matches!(validate_id(""), Err(AppError::Invalid(_))));
        assert!(validate_id(&Uuid::new_v4().to_string()).is_ok());
    }
}

