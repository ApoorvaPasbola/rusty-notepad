import {
  ChangeDetectorRef,
  Component,
  computed,
  HostListener,
  Signal,
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
  activeIndex = computed(() => {
    if (this.viewService.currentTab())
      return this.viewService.currentTab()?.id!;
    else
      return -1
  });

  wasTabClosed: boolean = false;
  openedTabsSize: number = 0;


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
    let index = (this.activeIndex()! + 1) % this.openedTabs.size;
    let tab = { ...this.openedTabs.get(this.getPathWithIndex(index))!, selected: true };
    this.activeTabChangeActions(tab)
  }


  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }
    if (!this.openedTabs.has(tabEvent.path))
      this.newTabActions(this.openedTabs.size, tabEvent.path, tabEvent.file_name, false);
    else {
      this.viewService.currentTab.set({ ...this.openedTabs.get(tabEvent.path)! });
    }
  }

  /**
   * New Tab on Ctrl + N
   */
  @HostListener('document:keydown.control.N')
  createBlankTab() {
    this.newTabActions(this.openedTabs.size, NEW_TAB_DEFAULT.path, NEW_TAB_DEFAULT.title, true)
    console.log("Current configs ", this.viewService.currentWorkingDirectory(), 
      this.viewService.currentWorkingFileName(), this.viewService.currentWorkpadFilePath());

  }

  @HostListener('document:keydown.control.W')
  closeTab() {
    this.tabClose({ index: this.activeIndex() } as TabViewCloseEvent);
  }


  /**
 * All things needs to be done to create a new tab
 */
  newTabActions(id: number, new_path: string, file_name: string, isNewTab: boolean) {
    let tab: Tab = { ...NEW_TAB_DEFAULT, id: id, title: file_name, path: new_path, isNewTab: isNewTab };
    console.log("New tab action ", tab);
    
    this.activeTabChangeActions(tab, true);
  }
  /**
   * Actions needs to be done while switching a tab
   * Actions
   * 1. Set current tab as inactive . selective false
   * 2. Set the new tab as activetab. update the service for current active tab
   * 3. Emit event for tab change. 
   * 4. update openedTabsize if changed 
   */
  activeTabChangeActions(tab: Tab, updateOpenedMaps?: boolean, deleating: boolean = false, eventType?:AppEvents) {
    if (updateOpenedMaps) {
      this.openedTabs.set(tab.path, tab);
    }
    // This handles the scenario where we want to un-select the older tabs as well.
    if (this.viewService.currentTab() && !deleating) {
      let tab = this.viewService.currentTab()!;
      this.openedTabs.set(tab.path, { ...tab, selected: false })
    }
    // This is requried so that there is not a same copy of the same object 
    this.viewService.currentTab.set({ ...tab });
    this.viewService.currentWorkingFileName.set(tab.title)
    this.viewService.currentWorkpadFilePath.set(tab.path)
    this.openedTabsSize = this.openedTabs.size
    this.triggerTabChangeEvent(eventType);
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
    if (event.index == this.viewService.currentTab()!.id) {

      // If there are no tabsMap is empty
      if (!this.openedTabs.size) {
        this.viewService.currentTab.set(undefined);
        this.wasTabClosed = false;
      }
      // Since the active tab is close we need to set a new active tab and trigger a Tab Change Event
      if (this.openedTabs.size) {
        // Need to handle the case where syncing the tabsMap changed the indexing
        let new_index = (event.index) % this.openedTabs.size;
        let path = this.getPathWithIndex(new_index);
        this.activeTabChangeActions({ ...this.openedTabs.get(path)!, selected: true }, true, true);
        return;
      }
    }
    this.openedTabsSize = this.openedTabs.size;
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
      this.activeTabChangeActions(tab, true)
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
  triggerTabChangeEvent(eventType?:AppEvents) {
    if (this.openedTabs.size) {
      this.viewService.notepadEvents$.next({
        path: this.viewService.currentTab()?.path,
        file_name: this.viewService.currentTab()?.title,
        type: eventType? eventType : AppEvents.TAB_CHANGE
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
