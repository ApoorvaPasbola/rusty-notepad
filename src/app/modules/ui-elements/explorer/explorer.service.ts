import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {

  public currentDirectories = signal<string[]>([])

  constructor() { }

  listDirectory(){
    let path = "D:\\OpenSourceSoftware\\rusty-notepad\\src\\app"

    invoke<string>("read_directory", { path }).then((response:any) => {
      console.log("Current Directories ", response);
      
      this.currentDirectories.set(response)
      console.log("signal value is ", this.currentDirectories());
      
    });
  }
}
