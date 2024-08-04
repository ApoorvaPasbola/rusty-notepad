import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Node } from '../../utilities/interfaces/Node';
import { FolderComponent } from './folder/folder.component';

@Component({
  selector: 'rusty-folder-tree',
  standalone: true,
  imports: [NgIf, NgFor, FolderComponent],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent {
  @Input('directory') dir: Node[] = [
    {
      name: 'Movies',
      nodes: [
        { name: 'Action', nodes: [{ name: '2000s' }, { name: '2010s' }] },
        { name: 'Comedy' },
      ],
    },
    { name: 'Music', nodes: [{ name: 'Rock' }, { name: 'Classical' }] },
    { name: 'Pictures' },
    { name: 'Documents' },
  ];
}
