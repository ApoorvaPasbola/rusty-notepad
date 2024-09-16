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
import { APP_COMMANDS } from '../../utilities/Constants';
import { ButtonModule } from 'primeng/button';
import { open } from '@tauri-apps/api/dialog';
import { FsStateService } from '../../services/fs/fs-state.service';

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
    LandingPageComponent,
    ButtonModule,
  ],
})
export class RustyViewComponent {

  appCommands = APP_COMMANDS;


  constructor(private viewService: ViewService, private fs: FsStateService) {

    /**
     * Initializes the Notepad with the starting directory . If nothing is passed in cli variable
     * It takes one from the env variables
     */
    getMatches().then(matches => {
      let path = matches.args['path'].value;
      if (typeof path == "string") {
        this.emitOpenDirectoryEvent(path);
      } else {
        this.emitOpenDirectoryEvent(undefined);
      }
    })
  }

  emitOpenDirectoryEvent(path: string | undefined) {
    this.viewService.notepadEvents$.next({
      path: path,
      type: AppEvents.APP_OPEN_DIR
    })
    this.fs.currentWorkingDirectory.set(path);

  }

  openWorkspace() {
      open({multiple:false,directory:true,title: "Open Workspace"}).then(path=>{
        if(typeof path == 'string')
        this.emitOpenDirectoryEvent(path);
      })
  }

}
