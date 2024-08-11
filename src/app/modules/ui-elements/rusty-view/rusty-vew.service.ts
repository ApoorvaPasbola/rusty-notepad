import { Injectable, signal } from '@angular/core';
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

  constructor() {}

  readFile(path: string) {
    if (path == '.') return this.workbook$.next('This is some default \n work from an file');
    invoke<string>('read_file', { path }).then((data: string) => {
      this.workbook$.next(data);
    });
  }

  saveFile(file: SaveFileEvent) {
    if(file.data && file.path ){
      let path = file.path
      let data = file.data
      
      invoke<string>('save_file',{ path, data }).then((res:string)=>{
        console.log("Response from the backend ", res);        
      })
    }
  }
}
