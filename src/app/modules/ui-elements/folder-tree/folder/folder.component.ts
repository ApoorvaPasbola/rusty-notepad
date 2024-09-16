import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Node } from '../../../utilities/interfaces/Node';
import { FolderTreeService } from '../folder-tree.service';
import { ViewService } from '../../rusty-view/rusty-vew.service';
import { AppEvents } from '../../../utilities/interfaces/Events';

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

  constructor(private fs: FolderTreeService, private viewService:ViewService) {
  }

  readFile(file: Node) {
    this.viewService.notepadEvents$.next({
      file_name: file.name,
      path: file.path,
      type: AppEvents.FILE_SYSTEM_READ
    })
  }

  openDirectory(folders: Node) {
    this.fs.openDirectory(folders);
  }


}
