import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { DEFAULT_NODE, Node } from '../../utilities/interfaces/Node';
import { FolderComponent } from './folder/folder.component';
import { FolderTreeService } from './folder-tree.service';

@Component({
  selector: 'rusty-folder-tree',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FolderComponent, UpperCasePipe],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent {

  workspace = computed(() => {
    return this.fsService.currentDirectories();
  })

  root = computed(()=>{
    return this.fsService.rootDir();
  })

  constructor(private fsService: FolderTreeService){
    this.fsService.listDirectory();
  }

  openDirectory(index:number) {
    this.workspace()[index].expanded = !this.workspace()[index].expanded
    console.log("Opening directory ", this.workspace()[index].name);
  }
}
