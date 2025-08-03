import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FolderComponent } from './folder/folder.component';
import { FolderTreeService } from './folder-tree.service';
import { filter, Subscription } from 'rxjs';
import { Node } from '../../utilities/interfaces/Node';
import { ViewService } from '../rusty-view/rusty-vew.service';
import { AppEvents } from '../../utilities/interfaces/Events';
import { RustyStateService } from '../../services/rusty/rusty-state.service';

@Component({
  selector: 'rusty-folder-tree',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FolderComponent, UpperCasePipe],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent implements OnDestroy {
  fileDirectories!: Node[] | undefined;
  subs$: Subscription[] = [];

  root!: Node | undefined;

  constructor(
    private fsService: FolderTreeService,
    private state: RustyStateService,
  ) {
    this.subs$.push(
      this.fsService.fileDirectoryStructure
        .pipe(filter((node) => node?.length != 0))
        .subscribe((ele: Node[] | undefined) => {
          this.fileDirectories = ele;
        }),
    );

    this.subs$.push(
      this.fsService.rootNode.subscribe((ele: Node | undefined) => {
        this.root = ele;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs$.forEach((sub) => sub.unsubscribe());
  }
}
