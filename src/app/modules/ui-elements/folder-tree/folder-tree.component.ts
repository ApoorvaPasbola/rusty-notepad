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
export class FolderTreeComponent implements OnDestroy{

  workspace!: Node[];
  workspace$!: Subscription

  root!: Node;
  root$!:Subscription;

  constructor(public fsService: FolderTreeService){
    this.workspace$ = this.fsService.workspace.subscribe((ele:Node[])=>{
      this.workspace = ele;
    })
    this.root$ = this.fsService.rootNode.subscribe((ele:Node)=>{
      this.root = ele;
    })
    this.fsService.initialize_Explorer();
  }

  ngOnDestroy(): void {
      this.workspace$.unsubscribe();
      this.root$.unsubscribe();
  }


}
