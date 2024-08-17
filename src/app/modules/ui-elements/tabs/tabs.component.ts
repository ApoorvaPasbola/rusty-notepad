import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { WorkpadComponent } from '../workpad/workpad.component';
import { Tab } from '../../utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../utilities/Constants';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { ViewService } from '../rusty-view/rusty-vew.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, TabViewModule, WorkpadComponent, NgFor, NgIf],
})
export class TabsComponent {


  /**
   * This is use to toggle active tab on Ctrl + Tab event
   */
  activeIndex: number = 0;
  wasTabClosed: boolean = false;
  activeTab: Tab | undefined;


  /**
   * This takes a list of tabs from the service which reads all the files
   */
  tabsMap: Map<string, Tab> = new Map();

  constructor(private viewService: ViewService, private cd: ChangeDetectorRef) {
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

  getTabsArray() {
    return this.tabsMap.values();
  }
  /**
   * Switch to next Tab on control + tab event
   */
  @HostListener('document:keydown.control.tab')
  changeTab() {
    this.tabsMap.set(this.activeTab!.path, { ...this.activeTab!, selected: false })
    this.activeIndex = (this.activeIndex + 1) % this.tabsMap.size;
    this.activeTab = { ...this.tabsMap.get(this.getPathWithIndex(this.activeIndex))!, selected: true };
    this.tabsMap.set(this.activeTab.path, { ...this.activeTab! })
    this.triggerTabChangeEvent();
  }


  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }
    if (!this.tabsMap.has(tabEvent.path))
      this.newTabActions(this.tabsMap.size, tabEvent.path, tabEvent.file_name)
    else {
      this.activeTab = { ...this.tabsMap.get(tabEvent.path)! }
      this.activeIndex = this.activeTab.id;
    }
  }


  /**
   * New Tab on Ctrl + N
   */
  @HostListener('document:keydown.control.N')
  createBlankTab() {
    this.newTabActions(this.tabsMap.size, NEW_TAB_DEFAULT.path, NEW_TAB_DEFAULT.title)
  }




  /**
   * This handles the tabs close event.
   * Scenarios -> Current Active tabs is closed , non-active tab is closed , last tab is closed
   * @param event TabViewCloseEvent
   */
  tabClose(event: TabViewCloseEvent) {
    this.wasTabClosed = true;
    let close_tab_path = this.getPathWithIndex(event.index);

    /** This handles non-active tab close and last tab close ,
     * we do not need to trigger Tab change event since we dont wont to
     * re-dender the workpad
     */
    this.tabsMap.delete(close_tab_path);
    if (event.index != this.tabsMap.size)
      this.syncTabs();
    // Handle Current Active tab closed
    if (event.index == this.activeIndex) {
      // If there are no tabsMap is empty
      if (!this.tabsMap.size) {
        this.activeTab = undefined;
        this.activeIndex = -1;
        this.wasTabClosed = false;
      }
      // Since the active tab is close we need to set a new active tab and trigger a Tab Change Event
      if (this.tabsMap.size) {
        // Need to handle the case where syncing the tabsMap changed the indexing
        this.activeIndex = (event.index) % this.tabsMap.size;
        let path = this.getPathWithIndex(this.activeIndex);
        this.tabsMap.set(path, { ...this.tabsMap.get(path)!, selected: true })
        this.activeTab = { ...this.tabsMap.get(path)! };
      }
    }
    this.triggerTabChangeEvent()
  }

  syncTabs() {
    let n = 0;
    this.tabsMap.forEach(tab => {
      this.tabsMap.set(tab.path, { ...tab, id: n++ })
    })
  }

  /**
   * Handles tabs change Event
   * @param index
   */
  handleTabIndexChange(index: number) {

    if (!this.wasTabClosed) {
      let path = this.getPathWithIndex(index);
      this.tabsMap.set(this.activeTab!.path, { ...this.activeTab!, selected: false })
      this.activeTab = { ...this.tabsMap.get(path)!, selected: true };
      this.activeIndex = index;
      this.tabsMap.set(path, { ...this.activeTab, selected: true })
      this.triggerTabChangeEvent();
    }
    this.wasTabClosed = false;


  }

  /**
 * All things needs to be done to create a new tab
 */
  newTabActions(id: number, new_path: string, file_name: string,) {
    let tab: Tab = { ...NEW_TAB_DEFAULT, id: id, title: file_name, path: new_path, };
    this.tabsMap.set(tab.path, tab);
    // This handles the scenario where we want to un-select the older tabs as well.
    if (this.activeTab) {
      this.tabsMap.set(this.activeTab.path, { ...this.activeTab, selected: false })
    }
    this.activeTab = { ...tab };
    this.activeIndex = id;
    this.triggerTabChangeEvent();
  }

  getPathWithIndex(index: number): string {
    let path = "";
    this.tabsMap.forEach((tab) => {
      if (tab.id == index) {
        path = tab.path;
      }
    })
    return path;
  }
  /**
   * This triggers an Tab Change Event to inform other components to take respective actions
   */

  triggerTabChangeEvent() {
    if (this.tabsMap.size) {
      this.viewService.notepadEvents$.next({
        path: this.activeTab!.path,
        file_name: this.activeTab!.title,
        type: AppEvents.TAB_CHANGE
      });
    } else {
      this.viewService.notepadEvents$.next({
        path: undefined,
        file_name: undefined,
        type: AppEvents.TABS_EMPTY
      });
    }

  }


}
