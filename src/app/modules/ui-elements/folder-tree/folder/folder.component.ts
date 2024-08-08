import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Node } from '../../../utilities/interfaces/Node';

@Component({
  selector: 'rusty-folder',
  standalone: true,
  imports: [NgFor],
  host: {
    '[style.list-style-type]': "none"
  },
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

  @Input() folders:Node[] | undefined;

}