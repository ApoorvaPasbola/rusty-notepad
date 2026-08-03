import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';

import { LandingPageComponent } from '../landing-page/landing-page.component';
import { getMatches } from '@tauri-apps/plugin-cli';
import { APP_COMMANDS } from '../../utilities/Constants';
import { ButtonModule } from 'primeng/button';
import { open } from '@tauri-apps/plugin-dialog';
import { RustyStateService } from '../../services/rusty/rusty-state.service';
import { Store } from '@ngrx/store';
import { updateWorkpadConfig } from '../../../state/actions/actions';

@Component({
  selector: 'app-rusty-view',
  templateUrl: './rusty-view.component.html',
  styleUrl: './rusty-view.component.scss',
  imports: [
    TabsComponent,
    WorkpadComponent,
    SplitterComponent,
    FolderTreeComponent,
    LandingPageComponent,
    ButtonModule,
  ],
})
export class RustyViewComponent {
  appCommands = APP_COMMANDS;

  constructor(
    private state: RustyStateService,
    private store: Store,
  ) {
    /**
     * Initializes the Notepad with the starting directory . If nothing is passed in cli variable
     * It takes one from the env variables
     */
    getMatches().then((matches:any) => {
      let path = matches.args['path'].value;
      if (typeof path == 'string') {
        this.emitOpenDirectoryEvent(path);
      } else {
        this.emitOpenDirectoryEvent(undefined);
      }
    });
  }

  emitOpenDirectoryEvent(path: string | undefined) {
    this.store.dispatch(
      updateWorkpadConfig({
        workpadState: {
          activeWorkingDirectory: path,
          activeWorkingFileName: undefined,
          activeWorkpadFilePath: undefined,
        },
      }),
    );
  }

  openWorkspace() {
    open({ multiple: false, directory: true, title: 'Open Workspace' }).then((path) => {
      if (typeof path == 'string') this.emitOpenDirectoryEvent(path);
    });
  }
}
