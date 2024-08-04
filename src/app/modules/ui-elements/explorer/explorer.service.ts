import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {

  constructor() { }

  listDirectory(event: any): void {
    event.preventDefault();
    let path = "D:\\OpenSourceSoftware\\rusty-notepad\\src\\app"

    invoke<string>("read_directory", { path }).then((paths: any) => {
      console.log("This is response form file_explorer ", paths );
    });
  }
}
