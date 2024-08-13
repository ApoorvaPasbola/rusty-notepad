import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from '../splitter/splitter.component';
import { FolderTreeComponent } from '../folder-tree/folder-tree.component';
import { ViewService } from './rusty-vew.service';
import { Subscription } from 'rxjs';
import { FileEvents} from '../../utilities/interfaces/Events';
import { save } from '@tauri-apps/api/dialog';
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
  ],
})
export class RustyViewComponent {
  workfile!: string;
  workFileSubs: Subscription;
  workfilePath: string | undefined = undefined;
  currentWorkingDirectory: string = environment.current_directory;
  currentFileName: string | undefined = "";

  constructor(private viewService: ViewService) {
    this.workFileSubs = this.viewService.workbook$.subscribe((data) => {
      this.workfile = data;
    });
  }

  updateWorkpad(fileEvent: FileEvents) {
    this.workfilePath = fileEvent.path;
    this.currentFileName = fileEvent.file_name;
    this.viewService.readFile$.next(fileEvent);
  }

  saveCurrentFile(event: FileEvents) {
    /**
     * If current workfile path is not present , then open save dialog on save event
     */
    if (!this.workfilePath) {
      save({ defaultPath: this.currentWorkingDirectory, title: "Save As" })
        .then((saveFilePath) => {
          console.log("save file path ", saveFilePath);
          if (saveFilePath) {
            this.workfilePath = saveFilePath;
            this.viewService.saveFile({ ...event, path: saveFilePath as string } as FileEvents);
          }
        })
    }
    else {
      this.viewService.saveFile({ ...event, path: this.workfilePath } as FileEvents);
    }
  }
}
