import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { DEFAULT_NODE, FileSystemItem, mapFileSystemItem2NodeList, Node } from '../../utilities/interfaces/Node';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderTreeService {

  workspace = new BehaviorSubject<Node[]>([]);
  rootNode = new BehaviorSubject<Node>(DEFAULT_NODE);

  private BASE_PATH: string = 'D:\\Repo\\personal_repos\\rusty\\rusty-notepad'

  constructor() { }

  initialize_Explorer(path: string = this.BASE_PATH) {
    invoke<FileSystemItem[]>("read_directory", { path }).then((directory_items: FileSystemItem[]) => {
      let nodes_list = mapFileSystemItem2NodeList(directory_items);
      let last_node = nodes_list.pop()
      if (last_node) {
        this.rootNode.next({ ...last_node, expanded: true })
      }
      this.workspace.next(nodes_list)
    });
  }

  expandDirectory(folder: Node) {
    let path = this.BASE_PATH + "\\" + folder.name
    invoke<FileSystemItem[]>("read_directory", { path }).then((items: FileSystemItem[]) => {
      folder.expanded = true;
      folder.nodes = mapFileSystemItem2NodeList(items)
    })
  }



}
