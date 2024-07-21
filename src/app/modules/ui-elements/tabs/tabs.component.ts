import { Component, Input } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule, NgFor } from '@angular/common';
import { WorkpadComponent } from '../workpad/workpad.component';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule,TabViewModule,WorkpadComponent, NgFor],
})
export class TabsComponent {
  /**
   * This takes a list of tabs from the service which reads all the files 
   */
  @Input("tabs") tabs: { id: number; content: string; title: string, isClosable:boolean,selected:boolean }[] = [
    {
      id: 1,
      selected: true,
      isClosable:true,
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
      isClosable:true,
      content:'ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat. \
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Tab 2',
    },
    {
      id: 3,
      selected: false,
      isClosable:true,
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim \
        ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commod consequat.',
      title: 'Tab 3',
    },
  ];
}
