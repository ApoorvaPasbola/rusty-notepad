import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule, NgFor } from '@angular/common';
import { WorkpadComponent } from '../workpad/workpad.component';
import { Tab } from '../../utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../utilities/Constants';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { environment } from '../../../../environments/environment';
import { ViewService } from '../rusty-view/rusty-vew.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, TabViewModule, WorkpadComponent, NgFor],
})
export class TabsComponent implements OnInit {

  /**
   * This is use to toggle active tab on Ctrl + Tab event
   */
  public activeIndex: number = 0;

  /**
   * This takes a list of tabs from the service which reads all the files
   */
  tabs: Tab[] = [];

  constructor(private viewService: ViewService) {
    this.viewService.notepadEvents$.pipe(
      filter(event =>
        event.type === AppEvents.TAB_CREATE ||
        event.type === AppEvents.TAB_DELETE

      ))
      .subscribe((event) => {
        switch (event.type) {
          case AppEvents.TAB_CREATE:
            this.newTab(event);
            break;
          default:
            console.debug("Some Unhandled Event recevied ", event, AppEvents[event.type]);
            break;
        }
      })
  }
  handleTabChange(event: NotepadEvents) {
  }

  ngOnInit(): void {
    if (this.tabs.length == 0) {
      this.tabs.push({ ...NEW_TAB_DEFAULT, id: 0, title: environment.init_file.file_name, path: environment.init_file.path })
      this.activeIndex = 0;
      this.tabs[0].selected = true
      this.triggerTabChangeEvent(0);
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
  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }

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

  triggerTabChangeEvent(index: number = 0,) {
    if (this.tabs?.length) {
      this.viewService.notepadEvents$.next({
        path: this.tabs[index].path,
        file_name: this.tabs[index].title,
        type: AppEvents.TAB_CHANGE
      });
    }
  }
}
