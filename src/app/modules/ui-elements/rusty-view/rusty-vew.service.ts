import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

    workbook = signal( "This is some default work from an file")

  constructor() { }

  readFile(pathStr: string ) {
    invoke<any>("read_file", { pathStr }).then((data:any) => {
           console.log("Loaded data form the file", data);
           this.workbook.set(data);
    })
  }

}
