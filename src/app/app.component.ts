import { Component, HostListener } from '@angular/core';
import { open } from '@tauri-apps/api/dialog';
import { ViewService } from './modules/ui-elements/rusty-view/rusty-vew.service';
import { AppEvents } from './modules/utilities/interfaces/Events';
import { FsStateService } from './modules/services/fs/fs-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private viewService: ViewService, private fs:FsStateService) { }

  @HostListener('document:keydown.control.O')
  openDirectory() {
    open({
      defaultPath: this.fs.currentWorkingDirectory(),
      multiple: false,
      directory: true,
    }).then(
      (path) => {
        console.debug('Opening Path ', path)
        if (typeof path == 'string') {
          this.fs.currentWorkingDirectory.set(path);
          this.viewService.notepadEvents$.next({
            path: path,
            type: AppEvents.APP_OPEN_DIR
          })
        }
      },
      (_) => console.error(_));
  }
}
