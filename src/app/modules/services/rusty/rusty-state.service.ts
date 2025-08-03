import { Injectable, Signal } from '@angular/core';
import { Tab } from '../../utilities/interfaces/Tab';
import { filter, Subject } from 'rxjs';
import {  NotepadEvents } from '../../utilities/interfaces/Events';
import { readFile } from '../../common/FileUtils';
import { Store } from '@ngrx/store';
import {  updateTabData, updateWorkpadConfig } from '../../../state/actions/actions';
import { TabState } from '../../../state';
import {  currentTab, selectAppState } from '../../../state/selectors/tabs-state-selectors';

@Injectable({
  providedIn: 'root'
})
export class RustyStateService {

  /**
   * Give the default path of the text file to be used when nothing is given
   */
  notepadEvents$ = new Subject<NotepadEvents>();


  appState: Signal<TabState>

  currentOpendFilePath:string = ""

  constructor(private store: Store) {
    this.appState = this.store.selectSignal(selectAppState);
    this.store.select(currentTab).pipe(filter(t=> t?.path != this.currentOpendFilePath && t?.path != undefined)).subscribe(tab=>{
      this.handleReadingFile(tab!)
      this.currentOpendFilePath = tab?.path ? tab.path : "";
    })
  }

  handleReadingFile(tab:Tab) {
    readFile(tab.path).then(
      (data) => {
        this.setWorkpadConfigs(tab, data);
      },
      (rejectResponse) => {
        this.resetWorkpadConfig(tab, rejectResponse);
      },
    );
  }

  setWorkpadConfigs(tab:Tab,data:string) {
    
    this.store.dispatch(updateWorkpadConfig({ workpadState: { ...this.appState().workpadState,activeWorkingFileName: tab.title, activeWorkpadFilePath: tab.path  } }));
    this.store.dispatch(updateTabData({data}));
  }

  resetWorkpadConfig(tab:Tab,data:string) {
    this.store.dispatch(updateWorkpadConfig({ workpadState: { activeWorkingFileName: undefined, activeWorkpadFilePath: undefined, activeWorkingDirectory: undefined } }));
  }
}

