import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { NgIf } from '@angular/common';
import { LandingPageComponent } from "../landing-page/landing-page.component";

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
    NgIf,
    LandingPageComponent
],
})
export class RustyViewComponent {

  constructor() {
  }


}
