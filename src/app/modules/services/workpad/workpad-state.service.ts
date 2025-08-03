import { Injectable, OnDestroy, Signal } from '@angular/core';
import { RustyStateService } from '../rusty/rusty-state.service';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { invoke } from '@tauri-apps/api';
import { filter, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { WorkpadState } from '../../../state';
import {
  currentTab,
  workpadState,
} from '../../../state/selectors/tabs-state-selectors';
import { Tab } from '../../utilities/interfaces/Tab';
import {
  currentTabChanged,
  tittleChanged,
} from '../../../state/actions/actions';

@Injectable({
  providedIn: 'root',
})
export class WorkpadStateService implements OnDestroy {
  private subs: Subscription;
  workpadState: Signal<WorkpadState>;
  currentTab: Signal<Tab | null>;

  constructor(
    private state: RustyStateService,
    private store: Store,
  ) {
    this.workpadState = this.store.selectSignal(workpadState);
    this.currentTab = this.store.selectSignal(currentTab);
    this.subs = this.state.notepadEvents$
      .pipe(filter((event) => event.type == AppEvents.WORKPAD_SAVE_REQUEST))
      .subscribe((event) => this.handleWorkpadEvents(event));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Controller to handle and control Workpad related Events
   * @param event NotepadEvents
   */
  handleWorkpadEvents(event: NotepadEvents) {
    this.handleSaveFile(event);
    // Emit a tab change event only if the file path is different and title is New Tab
    if (!this.currentTab()?.path && !this.currentTab()?.title) return;

    if (
      this.currentTab()?.path! != this.workpadState().activeWorkpadFilePath &&
      this.currentTab()?.title.search('New Tab')! > 0
    ) {
      let tab: Tab = {
        ...this.currentTab()!,
        title: this.workpadState().activeWorkingFileName!,
        path: this.workpadState().activeWorkpadFilePath!,
      };
      this.store.dispatch(currentTabChanged({ tab }));
      this.store.dispatch(tittleChanged({ tab }));
    }
  }

  handleSaveFile(event: NotepadEvents) {
    this.saveFile(event).then(
      (_) => console.info('File Saved successfully'),
      (reject) => console.error('File Saved Failed', reject),
    );
  }

  /**
   * Saves the file contents on the choosen directory.
   * If the file is not present then creates the file with the specified name and then stores the content .
   * If the file is present it stores the content in the exsisting file
   * @param file
   */
  saveFile(file: NotepadEvents): Promise<string> {
    if (file.data && file.path) {
      return invoke<string>('save_file', { path: file.path, data: file.data });
    } else if (file.data && this.workpadState().activeWorkpadFilePath) {
      return invoke<string>('save_file', {
        path: this.workpadState().activeWorkpadFilePath,
        data: file.data,
      });
    }
    return new Promise<string>((res, rej) => rej('Data or path not defined'));
  }
}
