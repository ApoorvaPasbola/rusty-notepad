import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import {
  deleteDraftFailure,
  hydrateDraftsFailure,
  readFileFailure,
  saveDraftFailure,
  saveFileFailure,
  loadExplorerFailure,
} from '../actions/actions';

/** Surface every `*Failure` action through PrimeNG's toast pipeline.
 *  Keeps UI feedback consistent and out of every individual effect. */
@Injectable()
export class NotificationsEffects {
  notifyFailures$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          readFileFailure,
          saveFileFailure,
          loadExplorerFailure,
          hydrateDraftsFailure,
          saveDraftFailure,
          deleteDraftFailure,
        ),
        tap((action) => {
          this.messages.add({
            severity: 'error',
            summary: this.summaryFor(action.type),
            detail: extractMessage(action),
            life: 5000,
          });
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly messages: MessageService,
  ) {}

  private summaryFor(type: string): string {
    if (type.includes('Read File')) return 'Could not open file';
    if (type.includes('Save File')) return 'Could not save file';
    if (type.includes('Explorer')) return 'Could not load directory';
    if (type.includes('Hydrate')) return 'Could not load drafts';
    if (type.includes('Save')) return 'Could not save draft';
    return 'Something went wrong';
  }
}

interface MaybeErrored {
  error?: string;
}
function extractMessage(action: MaybeErrored | unknown): string {
  if (action && typeof action === 'object' && 'error' in action) {
    return String((action as MaybeErrored).error ?? '');
  }
  return '';
}

