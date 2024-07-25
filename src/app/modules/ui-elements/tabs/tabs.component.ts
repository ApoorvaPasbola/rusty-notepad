import { ChangeDetectorRef, Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule, NgFor } from '@angular/common';
import { WorkpadComponent } from '../workpad/workpad.component';
import { Tab } from '../../utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../utilities/Constants';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, TabViewModule, WorkpadComponent, NgFor],
})
export class TabsComponent {

  constructor(private ref: ChangeDetectorRef){}

  /**
   * This is use to toggle active tab on Ctrl + Tab event 
   */
  activeIndex: number = 0;

  /**
   * This takes a list of tabs from the service which reads all the files 
   */
  @Input("tabs") tabs: Tab[] = [
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

  /**
   * Switch to next Tab on control + tab event 
   */
  @HostListener("document:keydown.control.tab")
  changeTab() {
    this.activeIndex = (this.activeIndex + 1) % this.tabs.length;
  }


  /**
   * New Tab on Ctrl + N 
   */
  @HostListener("document:keydown.control.N")
  newTab() {
    var newTab = NEW_TAB_DEFAULT
    newTab.id = this.tabs.length
    this.tabs.push(newTab)
    this.tabs[this.activeIndex].selected = false 
    this.activeIndex = newTab.id ;
  }

}
