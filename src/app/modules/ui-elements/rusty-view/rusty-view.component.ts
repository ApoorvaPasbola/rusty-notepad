import { Component, computed } from '@angular/core';
import { TabsComponent } from "../tabs/tabs.component";
import { WorkpadComponent } from '../workpad/workpad.component';
import { SplitterComponent } from "../splitter/splitter.component";
import { FolderTreeComponent } from "../folder-tree/folder-tree.component";
import { ViewService } from './rusty-vew.service';

@Component({
  selector: 'app-rusty-view',
  templateUrl: './rusty-view.component.html',
  styleUrl: './rusty-view.component.scss',
  standalone: true,
  imports: [TabsComponent, WorkpadComponent, SplitterComponent, FolderTreeComponent]
})
export class RustyViewComponent {

workfile = computed(()=>this.viewService.workbook())

constructor(private viewService:ViewService){
}

updateWorkpad(path: string) {
  this.viewService.readFile(path);
}

}
