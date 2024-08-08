import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { FileSystemItem, Node } from '../../utilities/interfaces/Node';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {

  public currentDirectories = signal<Node[]>([])

  constructor() { }

  listDirectory(path:string = "D:\\OpenSourceSoftware\\rusty-notepad\\src\\app"){
    invoke<FileSystemItem[]>("read_directory", { path }).then((directory_items:FileSystemItem[]) => {
      let nodes_list = directory_items.map(item=> { return {name: item.file_name, nodes:[], isDirectory: item.is_folder} as Node})
      console.log("Retured object is ", directory_items, nodes_list);
      
      this.currentDirectories.set(nodes_list)
    });
  }
}
