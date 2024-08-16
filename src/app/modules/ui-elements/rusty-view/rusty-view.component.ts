import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { ViewService } from './rusty-vew.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-rusty-view',
  templateUrl: './rusty-view.component.html',
  styleUrl: './rusty-view.component.scss',
  standalone: true,
  imports: [
    TabsComponent,
    WorkpadComponent,
    SplitterComponent,
    FolderTreeComponent,
    NgIf
  ],
})
export class RustyViewComponent {

  constructor() {
  }


}
