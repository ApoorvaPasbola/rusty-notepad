import { invoke } from '@tauri-apps/api/core';

/** Reads the content of a file at the given path via the Tauri backend.
 *  Rejects (typed `AppError` JSON) on missing path, oversized files,
 *  binary content, or permission errors. */
export function readFile(path: string | undefined): Promise<string> {
  if (!path) {
    return Promise.reject('Path is undefined');
  }
  return invoke<string>('read_file', { path });
}

