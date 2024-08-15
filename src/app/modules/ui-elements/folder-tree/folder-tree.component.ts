import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FolderComponent } from './folder/folder.component';
import { FolderTreeService } from './folder-tree.service';
import { Subscription } from 'rxjs';
import { Node } from '../../utilities/interfaces/Node';

@Component({
  selector: 'rusty-folder-tree',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FolderComponent, UpperCasePipe],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent implements OnDestroy {

  fileDirectories!: Node[];
  fileDirectories$!: Subscription;

  root!: Node;
  root$!: Subscription;

  constructor(private fsService: FolderTreeService) {
    this.fileDirectories$ = this.fsService.fileDirectoryStructure.subscribe((ele: Node[]) => {
      this.fileDirectories = ele;
    });
    this.root$ = this.fsService.rootNode.subscribe((ele: Node) => {
      this.root = ele;
    });
    this.fsService.initialize_Explorer();
  }

  ngOnDestroy(): void {
    this.fileDirectories$.unsubscribe();
    this.root$.unsubscribe();
  }

}
