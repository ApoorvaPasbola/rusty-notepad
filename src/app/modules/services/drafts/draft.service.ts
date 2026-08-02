import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { Draft, DraftMeta } from '../../utilities/interfaces/Draft';

/** Thin wrapper around the Tauri draft commands. Keeps `invoke` out of
 *  effects/components so they can be unit-tested with a mock service. */
@Injectable({ providedIn: 'root' })
export class DraftService {
  list(): Promise<DraftMeta[]> {
    return invoke<DraftMeta[]>('list_drafts');
  }

  read(id: string): Promise<Draft> {
    return invoke<Draft>('read_draft', { id });
  }

  save(draft: Draft): Promise<void> {
    return invoke<void>('save_draft', { draft });
  }

  delete(id: string): Promise<void> {
    return invoke<void>('delete_draft', { id });
  }
}

