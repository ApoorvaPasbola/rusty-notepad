import { Component } from '@angular/core';
import { TabsComponent } from "../tabs/tabs.component";
import { WorkpadComponent } from '../workpad/workpad.component';
import { Tab } from '../../utilities/interfaces/Tab';

@Component({
  selector: 'app-rusty-view',
  templateUrl: './rusty-view.component.html',
  styleUrl: './rusty-view.component.scss',
  standalone: true,
  imports: [TabsComponent, WorkpadComponent]
})
export class RustyViewComponent {


dummyData: Tab[] =  [
  {
    id: 1,
    selected: true,
    isClosable: true,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim \
      ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat. \
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    title: 'Tab 1',
  },
  {
    id: 2,
    selected: false,
    isClosable: true,
    content: 'ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat. \
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    title: 'Tab 2',
  },
  {
    id: 3,
    selected: false,
    isClosable: true,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim \
      ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat.',
    title: 'Tab 3',
  },
];

workfile: string = "This is some default work from an file";

updateWorkpad(event: Tab) {
  this.workfile = event.content;
}

}
