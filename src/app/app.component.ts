import { Component, HostListener, inject, Signal } from '@angular/core';
import { open } from '@tauri-apps/plugin-dialog';
import { RustyStateService } from '@core/rusty/rusty-state.service';
import { WorkpadStateService } from '@core/workpad/workpad-state.service';
import { Store } from '@ngrx/store';
import { WorkpadState } from './state';
import { workpadState } from '@state/selectors/tabs-state-selectors';
import { updateWorkpadConfig } from '@state/actions/actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: false
})
export class AppComponent {

  workpadService:WorkpadStateService
  workpadState:Signal<WorkpadState>

  constructor(private state:RustyStateService,private store:Store) {
    this.workpadState = this.store.selectSignal(workpadState)
    /**
     * Injecting basic services which are used all over the application
     */
    this.workpadService = inject(WorkpadStateService)

  }

  @HostListener('document:keydown.control.O')
  openDirectory() {
    open({
      defaultPath: this.workpadState().activeWorkingDirectory,
      multiple: false,
      directory: true,
    }).then(
      (path: any) => {
        if (typeof path == 'string') {
          this.store.dispatch(updateWorkpadConfig({workpadState: {...this.workpadState(), activeWorkingDirectory: path}}))
        }
      },
      (_: any) => console.error(_));
  }
}
