import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

    workbook$ = new BehaviorSubject<string>('This is some default \n work from an file')

  constructor() { }

  readFile(pathStr: string) {
    if(pathStr == ".") return;
    invoke<string>("read_file", { pathStr }).then((data:string) => {
           this.workbook$.next(data);
    })
  }



}
