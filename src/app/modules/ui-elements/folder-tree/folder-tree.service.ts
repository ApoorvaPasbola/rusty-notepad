import { Injectable, Signal } from '@angular/core';
import { invoke } from '@tauri-apps/api';
import { FileSystemItem, mapFileSystemItem2Node, mapFileSystemItem2NodeList, Node } from '../../utilities/interfaces/Node';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { WorkpadState } from '../../../state';
import { workpadState } from '../../../state/selectors/tabs-state-selectors';
@Injectable({
  providedIn: 'root'
})
export class FolderTreeService {

  fileDirectoryStructure = new Subject<Node[] | undefined>();
  rootNode = new Subject<Node | undefined>();
  ROOT_NAME: string = '';


  constructor(private store:Store) { 
    this.store.select(workpadState).subscribe((state: WorkpadState) => {
      this.initialize_Explorer(state.activeWorkingDirectory);
  })
}

  /**
   * The path to load on the file-explorer .TODO: Ideally this should come from the Input variable but as for now this works :p
   * @param path Absolute path of the directory to open.
   */
  initialize_Explorer(path: string | undefined) {
    if (!path) {
      this.fileDirectoryStructure.next(undefined);
      this.rootNode.next(undefined);
      return ;
    }

    invoke<FileSystemItem[]>("read_directory", { path }).then((directory_items: FileSystemItem[]) => {
      let last_node = directory_items.pop()
      if (last_node) {
        let nodes_list = mapFileSystemItem2NodeList(directory_items, path);
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
