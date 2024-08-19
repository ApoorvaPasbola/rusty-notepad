import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  currentWorkbookContent$ = new BehaviorSubject<string>(
    'This is some default \n work from an file',
  );
  currentWorkpadFilePath = signal<string | undefined>(undefined);
  currentWorkingDirectory = signal<string | undefined>(undefined);
  currentWorkingFileName = signal<string | undefined>(undefined);
  /**
   * Give the default path of the text file to be used when nothing is given
   */
  notepadEvents$ = new Subject<NotepadEvents>();

  constructor() {
    this.notepadEvents$.subscribe((event: NotepadEvents) => {
      switch (event.type) {
        case AppEvents.FILE_SYSTEM_OPEN:
        case AppEvents.FILE_SYSTEM_READ:
          this.handleFileSystemtEvents(event);
          break;

        case AppEvents.TAB_CHANGE:
        case AppEvents.TAB_CREATE:
        case AppEvents.TAB_DELETE:
        case AppEvents.TABS_EMPTY:
          this.handleTabsEvent(event);
          break;

        case AppEvents.WORKPAD_SAVE_REQUEST:
        case AppEvents.WORKPAD_SAVE_RESPONSE:
        case AppEvents.WORKPAD_UPDATE:
          this.handleWorkpadEvents(event);
          break;
        default:
          console.debug("Unknow Type of event ", event);
          break;
      }
    });
  }

  /**
   * Controller to handle and control tabs related functionalities
   * @param event NotepadEvents
   */
  handleTabsEvent(event: NotepadEvents) {
    switch (event.type) {
      // On Tab change we want to trigger Workpad Event
      case AppEvents.TAB_CHANGE:
      case AppEvents.TABS_EMPTY:
        this.handleReadingFile(event, AppEvents.WORKPAD_UPDATE);
        break;
      default:
        break;
    }
  }
  /**
   * Controller to handle and control File Explorer related Events
   * @param event NotepadEvents
   */
  handleFileSystemtEvents(event: NotepadEvents) {
    switch (event.type) {
      case AppEvents.FILE_SYSTEM_READ:
        // Triggering a new Tab event to create a new tab when we receive a open File event
        this.handleReadingFile(event, AppEvents.TAB_CREATE)
        break;
      default:
        console.debug("Received Open File event ", event);
        break;
    }
  }

  /**
   * Controller to handle and control Workpad related Events
   * @param event NotepadEvents
   */
  handleWorkpadEvents(event: NotepadEvents) {
    switch (event.type) {
      case AppEvents.WORKPAD_SAVE_REQUEST:
        this.handleSaveFile(event, AppEvents.WORKPAD_SAVE_RESPONSE)
        break
      default:
        break;
    }
  }

  handleReadingFile(event: NotepadEvents, eventType: AppEvents) {
    this.readFile(event.path).
      then(
        (fullfilledData) => {
          this.setWorkpadConfigs(event, eventType, fullfilledData);
        },
        (rejectResponse) => {
          this.resetWorkpadConfig(event, eventType, rejectResponse);
        });
  }

  setWorkpadConfigs(event: NotepadEvents, eventType: AppEvents, data: string) {
    this.currentWorkbookContent$.next(data)
    this.currentWorkingFileName.set(event.file_name)
    this.currentWorkpadFilePath.set(event.path)
    this.notepadEvents$.next({
      ...event,
      type: eventType,
    })
  }
  resetWorkpadConfig(event: NotepadEvents, eventType: AppEvents, data: string) {
    this.currentWorkbookContent$.next(data)
    this.currentWorkingFileName.set(undefined);
    this.currentWorkpadFilePath.set(undefined);
    this.notepadEvents$.next({
      ...event,
      type: eventType,
    })
  }

  readFile(path: string | undefined): Promise<string> {
    // If path is undefined the log a debug message and return the default values
    if (!path) {
      console.debug('Error while opening the file. Path undefined', path);
      return new Promise((_, reject) => reject("Lets write an epic :("))
    }

    console.debug('Reading file with path ', path);
    /**
     * Reads the content of the file from the given path
     */
    return invoke<string>('read_file', { path })
  }


  handleSaveFile(event: NotepadEvents, eventType: AppEvents) {
    this.saveFile(event).then(
      (resolved) => {
        this.notepadEvents$.next({
          ...event,
          type: eventType,
          data: resolved
        })
      },
      (reject) => {
        this.notepadEvents$.next({
          ...event,
          type: eventType,
          data: reject
        })
      }
    )

  }

  /**
   * Saves the file contents on the choosen directory.
   * If the file is not present then creates the file with the specified name and then stores the content .
   * If the file is present it stores the content in the exsisting file
   * @param file
   */
  saveFile(file: NotepadEvents): Promise<string> {
    if (!file.data && !file.path) {
      return new Promise<string>((res, rej) => rej("Data or path not defined"));
    }
    return invoke<string>('save_file', { path: file.path, data: file.data })
  }


}
