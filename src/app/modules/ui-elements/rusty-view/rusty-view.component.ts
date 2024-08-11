import { Component, computed } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { ViewService } from './rusty-vew.service';
import { Subscription } from 'rxjs';
import { SaveFileEvent } from '../../utilities/interfaces/Events';

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
  ],
})
export class RustyViewComponent {
  workfile!: string;
  workFileSubs: Subscription;
  workfilePath: string = '.';

  constructor(private viewService: ViewService) {
    this.workFileSubs = this.viewService.workbook$.subscribe((data) => {
      this.workfile = data;
    });
  }

  updateWorkpad(path: string) {
    this.workfilePath = path;
    this.viewService.readFile(path);
  }

  saveCurrentFile(event: SaveFileEvent) {
    this.viewService.saveFile({...event, path:this.workfilePath} as SaveFileEvent);
  }
}
