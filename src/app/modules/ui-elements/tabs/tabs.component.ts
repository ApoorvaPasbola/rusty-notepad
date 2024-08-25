import {
  ChangeDetectorRef,
  Component,
  HostListener,
  signal,
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
  openedTabsSize = signal(0);


  /**
   * This takes a list of tabs from the service which reads all the files
   */
  openedTabs: Map<string, Tab> = new Map();

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
    return this.openedTabs.values();
  }
  /**
   * Switch to next Tab on control + tab event
   */
  @HostListener('document:keydown.control.tab')
  changeTab() {
    let index  = (this.activeIndex + 1) % this.openedTabs.size;
    let tab  = { ...this.openedTabs.get(this.getPathWithIndex(this.activeIndex))!, selected: true };
    this.activeTabChangeActions(tab, index)
  }


  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }
    if (!this.openedTabs.has(tabEvent.path))
      this.newTabActions(this.openedTabs.size, tabEvent.path, tabEvent.file_name, false);
    else {
      this.activeTab = { ...this.openedTabs.get(tabEvent.path)! }
      this.activeIndex = this.activeTab.id;
      this.viewService.currentTab.set(this.activeTab);
    }
  }

  /**
   * New Tab on Ctrl + N
   */
  @HostListener('document:keydown.control.N')
  createBlankTab() {
    this.newTabActions(this.openedTabs.size, NEW_TAB_DEFAULT.path, NEW_TAB_DEFAULT.title, true)
  }

  /**
 * All things needs to be done to create a new tab
 */
  newTabActions(id: number, new_path: string, file_name: string, isNewTab: boolean) {
    let tab: Tab = { ...NEW_TAB_DEFAULT, id: id, title: file_name, path: new_path, isNewTab: isNewTab };
    this.activeTabChangeActions(tab, id, true);
  }
  /**
   * Actions needs to be done while switching a tab
   * Actions
   * 1. Set current tab as inactive . selective false
   * 2. Set the new tab as activetab. update the service for current active tab
   * 3. Emit event for tab change. 
   * 4. update openedTabsize if changed 
   */
  activeTabChangeActions(tab:Tab, id:number, updateOpenedMaps?:boolean){
    if(updateOpenedMaps){
      this.openedTabs.set(tab.path, tab);
    }
    // This handles the scenario where we want to un-select the older tabs as well.
    if (this.activeTab) {
      this.openedTabs.set(this.activeTab.path, { ...this.activeTab, selected: false })
    }
    // This is requried so that there is not a same copy of the same object 
    this.activeTab = { ...tab };
    this.activeIndex = id;
    this.openedTabsSize.set(this.openedTabs.size);
    this.viewService.currentTab.set(this.activeTab);
    this.triggerTabChangeEvent();
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
    this.openedTabs.delete(close_tab_path);
    if (event.index != this.openedTabs.size)
      this.syncTabs();
    // Handle Current Active tab closed
    if (event.index == this.activeIndex) {
      // If there are no tabsMap is empty
      if (!this.openedTabs.size) {
        this.activeTab = undefined;
        this.activeIndex = -1;
        this.wasTabClosed = false;
      }
      // Since the active tab is close we need to set a new active tab and trigger a Tab Change Event
      if (this.openedTabs.size) {
        // Need to handle the case where syncing the tabsMap changed the indexing
        this.activeIndex = (event.index) % this.openedTabs.size;
        let path = this.getPathWithIndex(this.activeIndex);
        this.openedTabs.set(path, { ...this.openedTabs.get(path)!, selected: true })
        this.activeTab = { ...this.openedTabs.get(path)! };
      }
    }
    this.openedTabsSize.set(this.openedTabs.size);
    this.triggerTabChangeEvent()
  }

  syncTabs() {
    let n = 0;
    this.openedTabs.forEach(tab => {
      this.openedTabs.set(tab.path, { ...tab, id: n++ })
    })
  }

  /**
   * Handles tabs change Event
   * @param index
   */
  handleTabIndexChange(index: number) {
    if (!this.wasTabClosed) {
      let path = this.getPathWithIndex(index);
      let tab = { ...this.openedTabs.get(path)!, selected: true };
      this.activeTabChangeActions(tab, index, true)
    }
    this.wasTabClosed = false;
  }



  getPathWithIndex(index: number): string {
    let path = "";
    this.openedTabs.forEach((tab) => {
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
    if (this.openedTabs.size) {
      this.viewService.notepadEvents$.next({
        path: this.activeTab!.path,
        file_name: this.activeTab!.title,
        type: AppEvents. 
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
