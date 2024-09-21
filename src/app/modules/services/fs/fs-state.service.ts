import { Injectable, signal } from '@angular/core';
import { Tab } from '../../utilities/interfaces/Tab';
import { RustyStateService } from '../rusty/rusty-state.service';
import { filter, tap } from 'rxjs';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { event } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class FsStateService {


  constructor(private state:RustyStateService) {
    this.state.notepadEvents$
    .pipe(
      tap(event => console.log("Event Received ", event)),
      filter(event => 
      event.type == AppEvents.FILE_SYSTEM_OPEN ||
      event.type == AppEvents.FILE_SYSTEM_READ
    )).subscribe(event => this.handleFileSystemtEvents(event))
   }


     /**
   * Controller to handle and control File Explorer related Events
   * @param event NotepadEvents
   */
  handleFileSystemtEvents(event: NotepadEvents) {
    console.log("This has been called ", event);
    
    switch (event.type) {
      case AppEvents.FILE_SYSTEM_READ:
        // Triggering a new Tab event to create a new tab when we receive a open File event
        this.state.handleReadingFile(event, AppEvents.TAB_CREATE);
        break;
      default:
        console.debug('Received Open File event ', event);
        break;
    }
  }
}
