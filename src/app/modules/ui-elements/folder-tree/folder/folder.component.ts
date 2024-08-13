import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Node } from '../../../utilities/interfaces/Node';
import { FolderTreeService } from '../folder-tree.service';
import { FileEvents, FileEventType, OpenFileEvent } from '../../../utilities/interfaces/Events';

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

  @Output() openFileEvent = new EventEmitter<FileEvents>()

  constructor(public fs:FolderTreeService){
  }

  readFile(file:Node) {
      this.openFileEvent.emit({
        file_name: file.name,
        path: file.path,
        type: FileEventType.OPEN
      })
  }
  handleOpenFileEvent(event:FileEvents){

    this.openFileEvent.emit(event);
  }

  openDirectory(folders: Node){
    this.fs.openDirectory(folders);
  }


}
