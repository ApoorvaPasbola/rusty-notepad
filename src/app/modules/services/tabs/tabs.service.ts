import { Injectable, OnDestroy } from '@angular/core';
import { filter, Subscription } from 'rxjs';
import { RustyStateService } from '../rusty/rusty-state.service';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
@Injectable({
  providedIn: 'root'
})
export class TabsService implements OnDestroy{

  private subs:Subscription;
  
  constructor(private state:RustyStateService) { 
    this.subs = this.state.notepadEvents$
    .subscribe( event => this.handleTabsEvent(event))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

    /**
   * Controller to handle and control tabs related functionalities
   * @param event NotepadEvents
   */
    handleTabsEvent(event: NotepadEvents) {
      switch (event.type) {
        // On Tab change we want to trigger Workpad Event
        case AppEvents.TAB_CHANGE:
          this.state.handleReadingFile(event, AppEvents.WORKPAD_UPDATE);
          break;
        case AppEvents.TABS_EMPTY:
          break;
        default:
          break;
      }
    }
}
