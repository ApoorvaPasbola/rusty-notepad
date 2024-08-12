import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Node } from '../../../utilities/interfaces/Node';
import { FolderTreeService } from '../folder-tree.service';
import { OpenFileEvent } from '../../../utilities/interfaces/Events';

@Component({
  selector: 'rusty-folder',
  standalone: true,
  imports: [NgFor,NgIf,NgClass],
  host: {
    '[style.list-style-type]': "none"
  },
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

  @Input() folders!:Node[];

  @Output() openFileEvent = new EventEmitter<OpenFileEvent>()

  constructor(public fs:FolderTreeService){
  }

  handleFileSystemClick(folders: Node[], index: number) {
    if (folders[index].isDirectory)
      this.fs.openDirectory(folders, index);
    else
      this.openFileEvent.emit({
        file_name: folders[index].name,
        path: folders[index].path,
      });
  }
}
