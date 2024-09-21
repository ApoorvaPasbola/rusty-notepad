import { Injectable } from '@angular/core';
import { RustyStateService } from '../rusty/rusty-state.service';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { invoke } from '@tauri-apps/api';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkpadStateService {

  constructor(private state:RustyStateService) { 
    this.state.notepadEvents$
    .pipe(
      filter(event => 
        event.type == AppEvents.WORKPAD_SAVE_REQUEST || 
        event.type == AppEvents.WORKPAD_UPDATE || 
        event.type == AppEvents.WORKPAD_SAVE_RESPONSE
      )).subscribe( event => this.handleWorkpadEvents(event))
  }

    /**
   * Controller to handle and control Workpad related Events
   * @param event NotepadEvents
   */
    handleWorkpadEvents(event: NotepadEvents) {
      switch (event.type) {
        case AppEvents.WORKPAD_SAVE_REQUEST:
          this.handleSaveFile(event, AppEvents.WORKPAD_SAVE_RESPONSE);
          // Emit a tab change event only if the file path is different and title is New Tab
          if (
            this.state.currentTab()?.path !=
              this.state.currentWorkpadFilePath() &&
            this.state.currentTab()?.title == 'New Tab'
          ) {
            this.state.currentTab.set({
              ...this.state.currentTab()!,
              title: this.state.currentWorkingFileName()!,
              path: this.state.currentWorkpadFilePath()!,
            });
            this.state.notepadEvents$.next({
              type: AppEvents.TAB_TITLE_CHANGE,
              file_name: this.state.currentWorkingFileName(),
              path: this.state.currentWorkpadFilePath(),
            });
          }
          break;
        default:
          break;
      }
    }

    handleSaveFile(event: NotepadEvents, eventType: AppEvents) {
      this.saveFile(event).then(
        (resolved) => {
          this.state.notepadEvents$.next({
            ...event,
            type: eventType,
            data: resolved,
          });
        },
        (reject) => {
          this.state.notepadEvents$.next({
            ...event,
            type: eventType,
            data: reject,
          });
        },
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
      } else if (file.data && this.state.currentWorkpadFilePath()) {
        return invoke<string>('save_file', {
          path: this.state.currentWorkpadFilePath(),
          data: file.data,
        });
      }
  
      return new Promise<string>((res, rej) => rej('Data or path not defined'));
    }
  


}
