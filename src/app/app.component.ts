import { Component, HostListener, inject } from '@angular/core';
import { open } from '@tauri-apps/api/dialog';
import { AppEvents } from './modules/utilities/interfaces/Events';
import { RustyStateService } from './modules/services/rusty/rusty-state.service';
import { FsStateService } from './modules/services/fs/fs-state.service';
import { TabsService } from './modules/services/tabs/tabs.service';
import { WorkpadStateService } from './modules/services/workpad/workpad-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  fsServcice:FsStateService
  tabsService:TabsService
  workpadService:WorkpadStateService
  
  constructor(private state:RustyStateService) { 
    /**
     * Injecting basic services which are used all over the application 
     */
    this.fsServcice = inject(FsStateService)
    this.tabsService = inject(TabsService)
    this.workpadService = inject(WorkpadStateService)

  }

  @HostListener('document:keydown.control.O')
  openDirectory() {
    open({
      defaultPath: this.state.currentWorkingDirectory(),
      multiple: false,
      directory: true,
    }).then(
      (path) => {
        console.debug('Opening Path ', path)
        if (typeof path == 'string') {
          this.state.currentWorkingDirectory.set(path);
          this.state.notepadEvents$.next({
            path: path,
            type: AppEvents.APP_OPEN_DIR
          })
        }
      },
      (_) => console.error(_));
  }
}
