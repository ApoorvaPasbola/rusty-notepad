import { Component, HostListener } from '@angular/core';
import { open } from '@tauri-apps/api/dialog';
import { AppEvents } from './modules/utilities/interfaces/Events';
import { RustyStateService } from './modules/services/rusty/rusty-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private state:RustyStateService) { }

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
