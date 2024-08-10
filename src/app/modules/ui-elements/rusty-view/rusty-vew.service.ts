import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

    workbook$ = new BehaviorSubject<String>('This is some default \n work from an file')

  constructor() { }

  readFile(pathStr: String) {
    if(pathStr == ".") return;
    invoke<String>("read_file", { pathStr }).then((data:String) => {
           ;
           this.workbook$.next(this.convertFileLineEndings(data));
    })
  }

  convertFileLineEndings(data: String){
    let newdata = data.split("\n\r").map((line) => `<p> ${line}`).join(" ")
    console.log("spliited data is ", newdata );
    return newdata;
  }

}
