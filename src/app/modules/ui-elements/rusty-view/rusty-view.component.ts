import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { NgIf } from '@angular/common';
import { LandingPageComponent } from "../landing-page/landing-page.component";
import { getMatches } from '@tauri-apps/api/cli';

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

  base_path!:string ;

  constructor() {
    getMatches().then(matches => {
      let path = matches.args['path'].value;
      if(typeof path == "string"){
        this.base_path = path;
      }
      console.log("Matches are ", this.base_path);
    })
  }

}
