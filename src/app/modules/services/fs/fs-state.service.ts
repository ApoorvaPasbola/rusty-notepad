import { Injectable, OnDestroy, signal } from '@angular/core';
import { RustyStateService } from '../rusty/rusty-state.service';
import { filter, Subscription, tap } from 'rxjs';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';

@Injectable({
  providedIn: 'root'
})
export class FsStateService implements OnDestroy {

  private subs: Subscription;

  constructor(private state: RustyStateService) {
    this.subs = this.state.notepadEvents$.subscribe(event => this.handleFileSystemtEvents(event))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
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
