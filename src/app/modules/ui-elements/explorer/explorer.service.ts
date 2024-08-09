import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { DEFAULT_NODE, FileSystemItem, Node } from '../../utilities/interfaces/Node';

@Injectable({
  providedIn: 'root'
})
export class ExplorerService {

  public currentDirectories = signal<Node[]>([])
  public rootDir = signal<Node>(DEFAULT_NODE);

  constructor() { }

  listDirectory(path: string = 'D:\\Repo\\personal_repos\\rusty\\rusty-notepad') {
    invoke<FileSystemItem[]>("read_directory", { path }).then((directory_items: FileSystemItem[]) => {
      let nodes_list = directory_items.map(item => { return { ...DEFAULT_NODE, name: item.file_name, isDirectory: item.is_folder } as Node })
      let last_node = nodes_list.pop()
      if (last_node) {
        this.rootDir.set({...last_node,expanded:true});
      }
      nodes_list.sort((a,b)=> a.name.localeCompare(b.name)).sort((a,b)=> Number(b.isDirectory) - Number(a.isDirectory)  );
      this.currentDirectories.set(nodes_list)
    });
  }
}
