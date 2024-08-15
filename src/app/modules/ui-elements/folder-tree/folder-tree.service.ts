import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { DEFAULT_NODE, FileSystemItem, mapFileSystemItem2Node, mapFileSystemItem2NodeList, Node } from '../../utilities/interfaces/Node';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FolderTreeService {

  fileDirectoryStructure = new BehaviorSubject<Node[]>([]);
  rootNode = new BehaviorSubject<Node>(DEFAULT_NODE);
  ROOT_NAME: string = '';
  private BASE_PATH: string = environment.current_directory

  constructor() { }

  /**
   * The path to load on the file-explorer .TODO: Ideally this should come from the Input variable but as for now this works :p
   * @param path Absolute path of the directory to open.
   */
  initialize_Explorer(path: string = this.BASE_PATH) {
    invoke<FileSystemItem[]>("read_directory", { path }).then((directory_items: FileSystemItem[]) => {
      let last_node = directory_items.pop()
      if (last_node) {
        let nodes_list = mapFileSystemItem2NodeList(directory_items, this.BASE_PATH);
        this.rootNode.next({ ...mapFileSystemItem2Node(last_node), expanded: true })
        this.fileDirectoryStructure.next(nodes_list)
        this.ROOT_NAME = last_node.file_name;
      }
    });
  }

  /**
   * Basic checks before expanding the directory
   * @param workspace
   */
  openDirectory(workspace: Node) {
    if (!workspace.expanded && !workspace.nodes?.length)
      this.expandDirectory(workspace);
    workspace.expanded = !workspace.expanded

  }

  /**
   * Reads the contents of the directory and append to the exsisting structure
   * @param folder Node for which the subfolders and files needs to be read
   */
  expandDirectory(folder: Node) {
    invoke<FileSystemItem[]>("read_directory", { path: folder.path }).then((items: FileSystemItem[]) => {
      items.pop();
      folder.expanded = true;
      folder.nodes = mapFileSystemItem2NodeList(items, folder.path)
    })
  }

}
