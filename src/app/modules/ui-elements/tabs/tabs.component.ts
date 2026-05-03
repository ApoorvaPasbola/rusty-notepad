import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule, NgFor } from '@angular/common';
import { WorkpadComponent } from '../workpad/workpad.component';
import { Tab } from '../../utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../utilities/Constants';
import { OpenFileEvent, TabChangeEvent } from '../../utilities/interfaces/Events';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, TabViewModule, WorkpadComponent, NgFor],
})
export class TabsComponent implements OnInit{
  @Output() activeTabChangeEvent = new EventEmitter<TabChangeEvent>();

  /**
   * This is use to toggle active tab on Ctrl + Tab event
   */
  public activeIndex: number = 0;

  /**
   * This takes a list of tabs from the service which reads all the files
   */
  @Input('tabs') tabs: Tab[] = []; 

  ngOnInit(): void {
    if(this.tabs.length == 0){
      this.tabs.push({...NEW_TAB_DEFAULT, id:0})
      this.activeIndex = 0;
      this.tabs[0].selected = true
    }
  }
  /**
   * Switch to next Tab on control + tab event
   */
  @HostListener('document:keydown.control.tab')
  changeTab() {
    this.activeIndex = (this.activeIndex + 1) % this.tabs.length;
    this.triggerTabChangeEvent(this.activeIndex);
  }

  /**
   * New Tab on Ctrl + N
   */
  newTab(tabEvent: OpenFileEvent) {
    if (!tabEvent.file_name) this.createBlankTab();
    if (!tabEvent.path) this.createBlankTab();

    let newTab: Tab = {
      ...NEW_TAB_DEFAULT,
      id: this.tabs.length,
      title: tabEvent.file_name,
      path: tabEvent.path,
    };

    this.tabs.push(newTab);
    this.tabs[this.activeIndex].selected = false;
    this.activeIndex = newTab.id;
    this.triggerTabChangeEvent(this.activeIndex);
  }

  @HostListener('document:keydown.control.N')
  createBlankTab() {
    let newTab: Tab = { ...NEW_TAB_DEFAULT, id: this.tabs.length };
    this.tabs.push(newTab);
    this.tabs[this.activeIndex].selected = false;
    this.activeIndex = newTab.id;
    this.triggerTabChangeEvent(this.activeIndex);
  }

  triggerTabChangeEvent(index: number = 0) {
    if (this.tabs?.length)
      this.activeTabChangeEvent.emit({ path: this.tabs[index].path, file: this.tabs[index].title});
  }
}
