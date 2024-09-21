import { Injectable } from '@angular/core';
import { filter } from 'rxjs';
import { RustyStateService } from '../rusty/rusty-state.service';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
@Injectable({
  providedIn: 'root'
})
export class TabsService {

  constructor(private state:RustyStateService) { 
    this.state.notepadEvents$
    .pipe(
      filter(event => 
        event.type == AppEvents.TABS_EMPTY || 
        event.type == AppEvents.TAB_DELETE || 
        event.type == AppEvents.TAB_CREATE || 
        event.type == AppEvents.TAB_CHANGE 
      )).subscribe( event => this.handleTabsEvent(event))
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
