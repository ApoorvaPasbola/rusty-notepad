import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { NgIf } from '@angular/common';
import { LandingPageComponent } from "../landing-page/landing-page.component";
import { getMatches } from '@tauri-apps/api/cli';
import { ViewService } from './rusty-vew.service';
import { AppEvents } from '../../utilities/interfaces/Events';
import { environment } from '../../../../environments/environment';

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


  constructor(private viewService: ViewService) {

    /**
     * Initializes the Notepad with the starting directory . If nothing is passed in cli variable
     * It takes one from the env variables
     */
    getMatches().then(matches => {
      let path = matches.args['path'].value;
      if (typeof path != "string") {
        path = environment.current_directory;
      }
      this.viewService.notepadEvents$.next({
        path: path,
        type: AppEvents.APP_OPEN_DIR
      })
      this.viewService.currentWorkingDirectory.set(path);
    })
  }

}
