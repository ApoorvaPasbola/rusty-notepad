import { Injectable, signal } from '@angular/core';
import { Tab } from '../../utilities/interfaces/Tab';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { readFile } from '../../common/FileUtils';
import { event } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class RustyStateService {

  /**
   * Current Tab which have metadata which can be used in other components 
   */
  currentTab = signal<Tab | undefined>(undefined);

  /**
  * Current Working Directory which have metadata which can be used in other components 
  */
  currentWorkingDirectory = signal<string | undefined>(undefined);

  /**
  * Current Workpad File Path which have metadata which can be used in other components 
  */
  currentWorkpadFilePath = signal<string | undefined>(undefined);

  /**
   * Current Working File Name which have metadata which can be used in other components 
   */
  currentWorkingFileName = signal<string | undefined>(undefined);

  /**
   * Contents of the current opened file. 
   */
  currentWorkbookContent$ = new BehaviorSubject<string>(
    'This is some default \n work from an file',
  );

  /**
   * Give the default path of the text file to be used when nothing is given
   */
  notepadEvents$ = new Subject<NotepadEvents>();

  constructor() { 
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
    this.currentWorkbookContent$.next(data);
    this.currentWorkpadFilePath.set(event.path);
    this.currentWorkingFileName.set(event.file_name);
    this.notepadEvents$.next({
      ...event,
      type: eventType,
    });
  }

  resetWorkpadConfig(event: NotepadEvents, eventType: AppEvents, data: string) {
    this.currentWorkbookContent$.next(data);
    this.currentWorkingFileName.set(undefined);
    this.currentWorkpadFilePath.set(undefined);
    this.notepadEvents$.next({
      ...event,
      type: eventType,
    });
  }
}
