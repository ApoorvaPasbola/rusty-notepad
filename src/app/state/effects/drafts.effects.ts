import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { from, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  addTab,
  closeTab,
  deleteDraftFailure,
  deleteDraftRequest,
  deleteDraftSuccess,
  editorContentChanged,
  hydrateDraftsFailure,
  hydrateDraftsRequest,
  hydrateDraftsSuccess,
  saveDraftFailure,
  saveDraftRequest,
  saveDraftSuccess,
  saveFileRequest,
  saveFileSuccess,
  tabDraftIdAssigned,
  updateTabTitle,
} from '../actions/actions';
import { selectAllTabs } from '../selectors/tabs-state-selectors';
import { DraftService } from '../../modules/services/drafts/draft.service';
import {
  Draft,
  DraftFormat,
} from '../../modules/utilities/interfaces/Draft';
import { Tab } from '../../modules/utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../modules/utilities/Constants';
import { DEFAULT_DRAFT_TITLE } from '../../modules/utilities/helper-functions/draft-title';

@Injectable()
export class DraftsEffects implements OnInitEffects {
  ngrxOnInitEffects(): Action {
    return hydrateDraftsRequest();
  }

  /** Load every persisted draft on startup. */
  hydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(hydrateDraftsRequest),
      switchMap(() =>
        from(this.draftService.list()).pipe(
          switchMap((metas) =>
            metas.length === 0
              ? of([])
              : from(Promise.all(metas.map((m) => this.draftService.read(m.id)))),
          ),
          map((drafts) => hydrateDraftsSuccess({ drafts })),
          catchError((error) =>
            of(hydrateDraftsFailure({ error: String(error) })),
          ),
        ),
      ),
    ),
  );

  /** Materialise hydrated drafts as tabs. */
  openHydratedDrafts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(hydrateDraftsSuccess),
      withLatestFrom(this.store.select(selectAllTabs)),
      switchMap(([{ drafts }, tabs]) => {
        const startId = tabs.length;
        const newTabs: Tab[] = drafts.map((d, idx) => ({
          ...NEW_TAB_DEFAULT,
          id: startId + idx,
          title: d.title || NEW_TAB_DEFAULT.title,
          path: d.originalPath ?? '',
          isNewTab: !d.originalPath,
          content: d.content,
          draftId: d.id,
          selected: false,
        }));
        return newTabs.map((tab) => addTab({ tab }));
      }),
    ),
  );

  /** Route editor changes to either disk (path-backed) or draft (unsaved). */
  routeEditorChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editorContentChanged),
      withLatestFrom(this.store.select(selectAllTabs)),
      mergeMap(([{ tabId, content, format, title }, tabs]) =>
        this.buildPersistActions(tabId, content, format, title, tabs),
      ),
    ),
  );

  /** Persist a draft to disk via the Tauri command. */
  save$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveDraftRequest),
      mergeMap(({ draft, tabId }) =>
        from(this.draftService.save(draft)).pipe(
          switchMap(() => [
            saveDraftSuccess({ draftId: draft.id, tabId }),
            tabDraftIdAssigned({ tabId, draftId: draft.id }),
          ]),
          catchError((e) => of(saveDraftFailure({ error: String(e) }))),
        ),
      ),
    ),
  );

  /** Remove a draft from disk. Idempotent. */
  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDraftRequest),
      mergeMap(({ draftId }) =>
        from(this.draftService.delete(draftId)).pipe(
          map(() => deleteDraftSuccess({ draftId })),
          catchError((e) => of(deleteDraftFailure({ error: String(e) }))),
        ),
      ),
    ),
  );

  /** Drop the draft once its contents have been committed to a real file. */
  cleanupDraftOnFileSave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(saveFileSuccess),
      withLatestFrom(this.store.select(selectAllTabs)),
      map(([{ path }, tabs]) =>
        tabs.find((t) => t.path === path && !!t.draftId),
      ),
      filter((tab): tab is Tab => !!tab),
      map((tab) => deleteDraftRequest({ draftId: tab.draftId! })),
    ),
  );

  /** Drop the draft when the user closes the tab. */
  cleanupDraftOnClose$ = createEffect(() =>
    this.actions$.pipe(
      ofType(closeTab),
      filter(({ draftId }) => !!draftId),
      map(({ draftId }) => deleteDraftRequest({ draftId: draftId! })),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly draftService: DraftService,
  ) {}

  // ----- helpers ---------------------------------------------------------

  /** Decide how to persist an edit and (for drafts) keep the tab title in
   *  sync with the content's first words. Returns the actions to dispatch. */
  private buildPersistActions(
    tabId: number,
    content: string,
    format: DraftFormat,
    title: string,
    tabs: Tab[],
  ): Action[] {
    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) return [];

    // A saved, file-backed tab writes straight to its file.
    if (!tab.isNewTab && tab.path) {
      return [saveFileRequest({ path: tab.path, data: content })];
    }

    // Otherwise it is an unsaved draft. Keep the UUID as the internal id and
    // on-disk filename; only the display title is derived from the content.
    const meaningfulTitle =
      title && title !== DEFAULT_DRAFT_TITLE ? title : null;
    const draftTitle = meaningfulTitle ?? tab.title;
    const draftId = tab.draftId ?? crypto.randomUUID();
    const draft: Draft = {
      id: draftId,
      title: draftTitle,
      content,
      format,
      originalPath: null,
      updatedAtMs: Date.now(),
    };

    const actions: Action[] = [saveDraftRequest({ draft, tabId })];
    if (meaningfulTitle && meaningfulTitle !== tab.title) {
      actions.push(updateTabTitle({ tab: { ...tab, title: meaningfulTitle } }));
    }
    return actions;
  }
}


