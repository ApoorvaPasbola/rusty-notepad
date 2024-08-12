import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { BehaviorSubject } from 'rxjs';
import { SaveFileEvent } from '../../utilities/interfaces/Events';

@Injectable({
  providedIn: 'root',
})
export class ViewService {
  workbook$ = new BehaviorSubject<string>(
    'This is some default \n work from an file',
  );

  constructor() { }

  readFile(path: string | undefined ) {
    console.log("Reading file with path ", path);
    
    // If path is undefined the return with error log 
    if( !path ) console.error("Error while opening the file. Path undefined", path);

    // Some default values to be retured for current directory path . TODO Needs to verify if this is required or not :( 
    if (path == '.') return this.workbook$.next('This is some default \n work from an file');

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
  saveFile(file: SaveFileEvent) {
    if (file.data && file.path) {
      invoke<string>('save_file', { path: file.path, data: file.data }).then((res: string) => {
        console.log("Response from the backend ", res);
      })
    }
  }
}
