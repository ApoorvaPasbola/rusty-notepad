import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { FileEvents, FileEventType } from '../../utilities/interfaces/Events';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  workbook$ = new BehaviorSubject<string>(
    'This is some default \n work from an file',
  );

  /**
   * Give the default path of the text file to be used when nothing is given
   */
  readFile$ = new Subject<FileEvents>();

  constructor() {
    this.readFile$.subscribe((event:FileEvents) => {
      this.readFile(event.path);
    })
  }

  readFile(path: string | undefined ) {

    // If path is undefined the log a debug message and return the default values
    if( !path ) {
      console.debug("Error while opening the file. Path undefined", path);
      return this.workbook$.next('This is some default \n work from an file');
    }

    console.debug("Reading file with path ", path);
    /**
     * Reads the content of the file from the given path
     */
    invoke<string>('read_file', { path }).then((data: string) => {
      this.workbook$.next(data);
    });
  }

  /**
   * Saves the file contents on the choosen directory.
   * If the file is not present then creates the file with the specified name and then stores the content .
   * If the file is present it stores the content in the exsisting file
   * @param file
   */
  saveFile(file: FileEvents) {
    if (file.data && file.path) {
      invoke<string>('save_file', { path: file.path, data: file.data }).then((res: string) => {
        console.debug(res);
      })
    }
  }
}
