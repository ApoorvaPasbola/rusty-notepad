import { Injectable, Signal } from '@angular/core';
import { DraftNotes, Tab } from '../../utilities/interfaces/Tab';
import { Subject } from 'rxjs';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { readFile } from '../../common/FileUtils';
import { Store } from '@ngrx/store';
import {  add, updateWorkpadConfig } from '../../../state/actions/actions';
import { TabState } from '../../../state';
import {  selectAppState } from '../../../state/selectors/selectors';

@Injectable({
  providedIn: 'root'
})
export class RustyStateService {



  /**
   * Give the default path of the text file to be used when nothing is given
   */
  notepadEvents$ = new Subject<NotepadEvents>();


  appState: Signal<TabState>


  /**
   * Unsaved Draft Notes state 
   */
  draftNotes: Map<string, DraftNotes> = new Map();

  constructor(private store: Store) {
    this.appState = this.store.selectSignal(selectAppState);
  }

  handleReadingFile(event: NotepadEvents, eventType: AppEvents) {
    readFile(event.path).then(
      (fullfilledData) => {
        this.setWorkpadConfigs(event, eventType, fullfilledData);
      },
      (rejectResponse) => {
        this.resetWorkpadConfig(event, eventType, rejectResponse);
      },
    );
  }

  setWorkpadConfigs(event: NotepadEvents, eventType: AppEvents, data: string) {
    this.store.dispatch(updateWorkpadConfig({ workpadState: { ...this.appState().workpadState,activeWorkingFileName: event.file_name!, activeWorkpadFilePath: event.path!  } }));
    let tab:Tab = {
      id:this.appState().tabs.length,
      title: event.file_name!,
      path: event.path!,
      isClosable: true,
      selected: true,
      isNewTab: false,
      content: data
    }
    this.store.dispatch(add({tab}));
    this.notepadEvents$.next({
      ...event,
      type: eventType,
    });
  }

  resetWorkpadConfig(event: NotepadEvents, eventType: AppEvents, data: string) {
    this.store.dispatch(updateWorkpadConfig({ workpadState: { activeWorkingFileName: undefined, activeWorkpadFilePath: undefined, activeWorkingDirectory: undefined } }));
    this.notepadEvents$.next({
      ...event,
      type: eventType,
    });
  }
}

