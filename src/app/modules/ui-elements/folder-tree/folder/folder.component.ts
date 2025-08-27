import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Node } from '../../../utilities/interfaces/Node';
import { FolderTreeService } from '../folder-tree.service';
import { AppEvents } from '../../../utilities/interfaces/Events';
import { RustyStateService } from '../../../services/rusty/rusty-state.service';

@Component({
  selector: 'rusty-folder',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  host: {
    '[style.list-style-type]': "none"
  },
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

  @Input() folders!: Node[];

  constructor(private fs: FolderTreeService, private state:RustyStateService) {
  }

  readFile(file: Node) {
    this.state.notepadEvents$.next({
      file_name: file.name,
      path: file.path,
      type: AppEvents.TAB_CREATE
    })
  }

  openDirectory(folders: Node) {
    this.fs.openDirectory(folders);
  }

}
