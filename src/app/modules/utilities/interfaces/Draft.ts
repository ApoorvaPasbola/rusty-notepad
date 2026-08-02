/** Persistence format for a draft body. Matches the Rust `DraftFormat` enum. */
export type DraftFormat = 'delta' | 'text';

/** Full draft payload as stored on disk. `originalPath` is set if the draft
 *  originated from a saved file that was later edited offline. */
export interface Draft {
  id: string;
  title: string;
  content: string;
  format: DraftFormat;
  originalPath?: string | null;
  updatedAtMs: number;
}

/** Lightweight summary returned by `list_drafts` (no `content`). */
export interface DraftMeta {
  id: string;
  title: string;
  originalPath?: string | null;
  updatedAtMs: number;
}

