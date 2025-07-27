import { Component, computed, HostListener, Signal } from '@angular/core';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { CommonModule, KeyValue, NgFor, NgIf } from '@angular/common';
import { DraftNotes, Tab } from '../../utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../utilities/Constants';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { filter } from 'rxjs';
import { RustyStateService } from '../../services/rusty/rusty-state.service';
import { v4 as uuid4 } from 'uuid';
import { Store } from '@ngrx/store';
import {  currentTab, selectAppState, workpadState } from '../../../state/selectors/selectors';
import { add, closeTab, currentTabChanged, updateWorkpadConfig } from '../../../state/actions/actions';
import { TabState, WorkpadState } from '../../../state';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, TabViewModule, NgFor, NgIf],
})
export class TabsComponent {

  wasTabClosed: boolean = false;

  /**
   * This takes a list of tabs from the service which reads all the files
   */
  openedTabs: Map<string, Tab> = new Map();
  workpadState: Signal<WorkpadState>
  

  tabs: Signal<TabState>;
  activeTab: Signal<Tab|null>;

    /**
   * This is use to toggle active tab on Ctrl + Tab event
   */
  activeIndex = computed(() => {
    if (this.activeTab()) return this.activeTab()?.id!;
    else return null; // TODO: Might be an issue ???
  });


  constructor(private state: RustyStateService, private store: Store) {
    this.tabs = this.store.selectSignal(selectAppState);
    this.activeTab = this.store.selectSignal(currentTab);
    this.workpadState = this.store.selectSignal(workpadState);
    this.state.notepadEvents$
      .pipe(
        filter(
          (event) =>
            event.type === AppEvents.TAB_CREATE ||
            event.type === AppEvents.TAB_TITLE_CHANGE,
        ),
      )
      .subscribe((event) => {
        switch (event.type) {
          case AppEvents.TAB_CREATE:
            this.newTab(event);
            break;
          case AppEvents.TAB_TITLE_CHANGE:
            this.openedTabs.set('', this.activeTab()!);
            break;
          default:
            console.debug(
              'Some Unhandled Event recevied ',
              event,
              AppEvents[event.type],
            );
            break;
        }
      });
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
    let tab = {
      ...this.openedTabs.get(this.getPathWithIndex(index))!,
      selected: true,
    };

    // TODO: if the current tab is a new tab then emit event to save the draft in the local store ??

    this.activeTabChangeActions(tab);
  }

  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }
    if (!this.openedTabs.has(tabEvent.path)){
      let tab:Tab = this.newTabActions(
        this.openedTabs.size,
        tabEvent.path,
        tabEvent.file_name,
        false,
      );
      this.store.dispatch(add({tab}));
     console.log("Current tabs stae is ", this.tabs()); 
    }
    else {
      this.store.dispatch(currentTabChanged({tab: this.openedTabs.get(tabEvent.path)!}))
    }
  }

  /**
   * New Tab on Ctrl + N
   */
  @HostListener('document:keydown.control.N')
  createBlankTab() {
    let newTabConfig = this.getNewTabConfig();
    let tab = this.newTabActions(
      this.openedTabs.size,
      newTabConfig.path,
      newTabConfig.title,
      true,
    );
    this.addNewTabToDraft(tab);
    this.store.dispatch(add({tab}));
    console.log("Current tabs stae is ", this.tabs());
    console.log("Current Active Index ", this.activeIndex());
    console.log("Current Active Tab ", this.activeTab());
  }

  @HostListener('document:keydown.control.Q')
  logger(){
    console.log("Current tabs stae is ", this.tabs());
    console.log("Current Active Index ", this.activeIndex());
    console.log("Current Active Tab ", this.activeTab());
  }

  /**
   * Generates a randon path which is unique and a new title for the new tab
   * @returns returns the path and title for a new tab
   */
  getNewTabConfig() {
    let title = `${NEW_TAB_DEFAULT.title} (${this.state.draftNotes.size + 1})`;
    let path = `${this.workpadState().activeWorkingDirectory}/${uuid4()}`;
    return { path: path, title: title };
  }

  /**
   * Adds the new unsaved tab to the state in the draftsNotes object . This is used to
   * maintain the state of the application on switching tabs on unsaved tabs.
   * @param tab
   */
  addNewTabToDraft(tab: Tab) {
    let draftNote: DraftNotes = {
      tab: tab,
      draftId: this.state.draftNotes.size + 1,
      content: '',
    };
    this.state.draftNotes.set(draftNote.tab.path, draftNote);
  }

  /**
   * Listner to close the active tab
   */
  @HostListener('document:keydown.control.W')
  closeTab() {  
    if(this.activeIndex() !=null && this.activeIndex()! >= 0)
    this.tabCloseOptimized({ index: this.activeIndex() } as TabViewCloseEvent);
  }

  /**
   * All things needs to be done to create a new tab
   */
  newTabActions(
    id: number,
    new_path: string,
    file_name: string,
    isNewTab: boolean,
  ):Tab {
    let tab: Tab = {
      ...NEW_TAB_DEFAULT,
      id: id,
      title: file_name,
      path: new_path,
      isNewTab: isNewTab,
    };
    this.activeTabChangeActions(tab, true);
    return tab;
  }

  /**
   * Actions needs to be done while switching a tab
   * Actions
   * 1. Set current tab as inactive . selective false
   * 2. Set the new tab as activetab. update the service for current active tab
   * 3. Emit event for tab change.
   * 4. update openedTabsize if changed
   */
  activeTabChangeActions(
    tab: Tab,
    updateOpenedMaps?: boolean,
    deleating: boolean = false,
    eventType?: AppEvents,
  ) {
    if (updateOpenedMaps) {
      this.openedTabs.set(tab.path, tab);
    }
    // This handles the scenario where we want to un-select the older tabs as well.
    if (this.activeTab() && !deleating) {
      let tab = this.activeTab()!;
      this.openedTabs.set(tab.path, { ...tab, selected: false });
    }

    // This is requried so that there is not a same copy of the same object
    let config: WorkpadState = { activeWorkingDirectory: this.workpadState().activeWorkingDirectory, activeWorkingFileName: tab.title, activeWorkpadFilePath: tab.path };
    this.store.dispatch(updateWorkpadConfig({ workpadState: config }))
    this.triggerTabChangeEvent(eventType);
  }

  tabCloseOptimized(event:TabViewCloseEvent){
    this.store.dispatch(closeTab({id: event.index}))
    this.tabClose(event);
    console.log("Tab Closed event called ", this.tabs());
    
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

    /**
     * This removes the entry from the draft notes if any
     */
    if (this.state.draftNotes.has(close_tab_path)) {
      this.state.draftNotes.delete(close_tab_path);
    }

    if (event.index != this.openedTabs.size) this.syncTabs();
    // Handle Current Active tab closed

    let tab:Tab;
    if (event.index == this.activeTab()!.id) {
      // If there are no tabsMap is empty
      if (!this.openedTabs.size) {
        this.wasTabClosed = false;
      }
      // Since the active tab is close we need to set a new active tab and trigger a Tab Change Event
      if (this.openedTabs.size) {
        // Need to handle the case where syncing the tabsMap changed the indexing
        let new_index = event.index % this.openedTabs.size;
        let path = this.getPathWithIndex(new_index);
        tab = { ...this.openedTabs.get(path)!, selected: true }
        this.activeTabChangeActions(
          tab,
          true,
          true,
        );
        return;
      }
    }
    this.triggerTabChangeEvent();
  }

  syncTabs() {
    let n = 0;
    this.openedTabs.forEach((tab) => {
      this.openedTabs.set(tab.path, { ...tab, id: n++ });
    });
  }

  /**
   * Handles tabs change Event
   * @param index
   */
  handleTabIndexChange(index: number) {
    if (!this.wasTabClosed) {
      let path = this.getPathWithIndex(index);
      let tab = { ...this.openedTabs.get(path)!, selected: true };
      this.activeTabChangeActions(tab, true);
      this.store.dispatch(currentTabChanged({tab}));
    }
    this.wasTabClosed = false;
  }

  getPathWithIndex(index: number): string {
    let path = '';
    this.openedTabs.forEach((tab) => {
      if (tab.id == index) {
        path = tab.path;
      }
    });
    return path;
  }

  /**
   * This triggers an Tab Change Event to inform other components to take respective actions
   */
  triggerTabChangeEvent(eventType?: AppEvents) {
    if (this.openedTabs.size) {
    } else {
      this.state.notepadEvents$.next({
        path: undefined,
        file_name: undefined,
        type: AppEvents.TABS_EMPTY,
      });
    }
  }

  /**
   * Id based comparator for the keyvalue Pipe . This is so that new tabs are added in order instead of random order.
   * @param a First comparator
   * @param b Second comparator
   */
  idBasedOrder = (
    a: KeyValue<string, Tab>,
    b: KeyValue<string, Tab>,
  ): number => {
    return a.value.id - b.value.id;
  };
}
