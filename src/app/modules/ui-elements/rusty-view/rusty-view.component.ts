import { Component } from '@angular/core';
import { TabsComponent } from "../tabs/tabs.component";
import { WorkpadComponent } from '../workpad/workpad.component';

@Component({
  selector: 'app-rusty-view',
  templateUrl: './rusty-view.component.html',
  styleUrl: './rusty-view.component.scss',
  standalone: true,
  imports: [TabsComponent, WorkpadComponent]
})
export class RustyViewComponent {

workfile: string = "This is some default work from an file";

}
