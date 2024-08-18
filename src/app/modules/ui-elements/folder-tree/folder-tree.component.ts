import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FolderComponent } from './folder/folder.component';
import { FolderTreeService } from './folder-tree.service';
import { filter, Subscription } from 'rxjs';
import { Node } from '../../utilities/interfaces/Node';
import { ViewService } from '../rusty-view/rusty-vew.service';
import { AppEvents } from '../../utilities/interfaces/Events';

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
  appEvents$!:Subscription;

  constructor(private fsService: FolderTreeService, private viewService:ViewService) {
    this.fileDirectories$ = this.fsService.fileDirectoryStructure.subscribe((ele: Node[]) => {
      this.fileDirectories = ele;
    });
    this.root$ = this.fsService.rootNode.subscribe((ele: Node) => {
      this.root = ele;
    });
    this.fsService.initialize_Explorer();

    this.appEvents$ = this.viewService.notepadEvents$
    .pipe(
      filter(event=> event.type == AppEvents.APP_OPEN_DIR))
      .subscribe((event) => {
        this.fsService.initialize_Explorer(event.path);
      })

  }

  ngOnDestroy(): void {
    this.fileDirectories$.unsubscribe();
    this.root$.unsubscribe();
    this.appEvents$.unsubscribe();
  }

}
