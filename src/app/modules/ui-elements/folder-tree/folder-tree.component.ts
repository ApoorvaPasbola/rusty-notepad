import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DEFAULT_NODE, Node } from '../../utilities/interfaces/Node';
import { FolderComponent } from './folder/folder.component';

@Component({
  selector: 'rusty-folder-tree',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FolderComponent],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent {
openDirectory(index:number) {
  this.workspace[index].expanded = !this.workspace[index].expanded
  console.log("Opening directory ", this.workspace[index].name);

}
  @Input('workspace') workspace!: Node[]

  @Input('root') root: Node = {...DEFAULT_NODE, isDirectory:true, expanded: true, name: "Unknow-Workspace"}
}
