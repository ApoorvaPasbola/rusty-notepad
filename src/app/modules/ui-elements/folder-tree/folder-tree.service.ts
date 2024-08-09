import { Injectable, signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { DEFAULT_NODE, FileSystemItem, mapFileSystemItem2Node, mapFileSystemItem2NodeList, Node } from '../../utilities/interfaces/Node';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderTreeService {

  workspace = new BehaviorSubject<Node[]>([]);
  rootNode = new BehaviorSubject<Node>(DEFAULT_NODE);
  ROOT_NAME:string = '';
  private BASE_PATH: string = 'D:\\OpenSourceSoftware\\rusty-notepad'

  constructor() { }

  initialize_Explorer(path: string = this.BASE_PATH) {
    invoke<FileSystemItem[]>("read_directory", { path }).then((directory_items: FileSystemItem[]) => {
      let last_node = directory_items.pop()
      if (last_node) {
        let nodes_list = mapFileSystemItem2NodeList(directory_items, last_node.file_name);
        this.rootNode.next({ ...mapFileSystemItem2Node(last_node), expanded: true })
        this.workspace.next(nodes_list)
        this.ROOT_NAME = last_node.file_name;
      }
    });
  }

  openDirectory(workspace:Node[], index:number) {
    if(workspace[index].isDirectory)
      return;
    workspace[index].expanded = ! workspace[index].expanded
    if(workspace[index].expanded && !workspace[index].nodes?.length)
      this.expandDirectory(workspace[index]);
  }

  expandDirectory(folder: Node) {
    let path;
    if(folder.parentNodeName.includes("."))
      path = this.BASE_PATH + "\\" + folder.parentNodeName.split(".").filter( value => value!=this.ROOT_NAME).join("\\") + "\\" + folder.name
    else
      path = this.BASE_PATH + "\\" + folder.name


    invoke<FileSystemItem[]>("read_directory", { path }).then((items: FileSystemItem[]) => {
      items.pop();
      folder.expanded = true;
      folder.nodes = mapFileSystemItem2NodeList(items, folder.parentNodeName.concat(".",folder.name) )
    })
  }

}
