import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FolderComponent } from './folder/folder.component';
import { FolderTreeService } from './folder-tree.service';
import { Subscription } from 'rxjs';
import { Node } from '../../utilities/interfaces/Node';
import { OpenFileEvent } from '../../utilities/interfaces/Events';

@Component({
  selector: 'rusty-folder-tree',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FolderComponent, UpperCasePipe],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent implements OnDestroy {

  @Output() openFileEvent = new EventEmitter<OpenFileEvent>();
  workspace!: Node[];
  workspace$!: Subscription;

  root!: Node;
  root$!: Subscription;

  constructor(public fsService: FolderTreeService) {
    this.workspace$ = this.fsService.workspace.subscribe((ele: Node[]) => {
      this.workspace = ele;
    });
    this.root$ = this.fsService.rootNode.subscribe((ele: Node) => {
      this.root = ele;
    });
    this.fsService.initialize_Explorer();
  }

  ngOnDestroy(): void {
    this.workspace$.unsubscribe();
    this.root$.unsubscribe();
  }

  handleFileSystemClick(index: number) {
    if (this.workspace[index].isDirectory)
      this.fsService.openDirectory(this.workspace, index);
    else
      this.openFileEvent.emit({
        file_name: this.workspace[index].name,
        path: this.workspace[index].path,
      });
  }

  handleNestedFileOpenEvent(event: OpenFileEvent) {
    console.log("this got called ", event);
    
    this.openFileEvent.emit(event);
  }
}
