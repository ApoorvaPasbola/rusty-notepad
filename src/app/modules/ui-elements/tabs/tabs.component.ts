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
import {
  currentTab,
  selectAppState,
  selectTabById,
  workpadState,
} from '../../../state/selectors/tabs-state-selectors';
import {
  add,
  closeTab,
  currentTabChanged,
  updateWorkpadConfig,
} from '../../../state/actions/actions';
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
  workpadState: Signal<WorkpadState>;

  tabState: Signal<TabState>;
  activeTab: Signal<Tab | null>;

  /**
   * This is use to toggle active tab on Ctrl + Tab event
   */
  activeIndex = computed(() => {
    if (this.activeTab()) return this.activeTab()?.id!;
    else return null; // TODO: Might be an issue ???
  });

  constructor(
    private state: RustyStateService,
    private store: Store,
  ) {
    this.tabState = this.store.selectSignal(selectAppState);
    this.activeTab = this.store.selectSignal(currentTab);
    this.workpadState = this.store.selectSignal(workpadState);
    this.state.notepadEvents$
      .pipe(
        filter(
          (event) =>
            event.type === AppEvents.TAB_CREATE 
        ),
      )
      .subscribe((event) => {
        switch (event.type) {
          case AppEvents.TAB_CREATE:
            this.newTab(event);
            break;
          default:
            break;
        }
      });
  }

  /**
   * Switch to next Tab on control + tab event
   */
  // @HostListener('document:keydown.control.tab')
  // changeTab() {
  //   // TODO: if the current tab is a new tab then emit event to save the draft in the local store ??

  //   this.activeTabChangeActions(tab);
  // }

  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }
    let exsistingTab:Tab|undefined = this.tabState().tabs.find(t=> t.path===tabEvent.path && t.title === tabEvent.file_name);
    if (!exsistingTab) {
      let tab: Tab = this.newTabActions(
        this.tabState().tabs.length,
        tabEvent.path,
        tabEvent.file_name,
        false,
      );
      this.store.dispatch(add({ tab }));
    } else {
      this.store.dispatch(
        currentTabChanged({ tab:exsistingTab }),
      );
    }
  }

  /**
   * New Tab on Ctrl + N
   */
  @HostListener('document:keydown.control.N')
  createBlankTab() {
    let newTabConfig = this.getNewTabConfig();
    let tab = this.newTabActions(
      this.tabState().tabs.length,
      newTabConfig.path,
      newTabConfig.title,
      true,
    );
    this.addNewTabToDraft(tab);
    this.store.dispatch(add({ tab }));
    console.log('Current tabs stae is ', this.tabState());
    console.log('Current Active Index ', this.activeIndex());
    console.log('Current Active Tab ', this.activeTab());
  }

  @HostListener('document:keydown.control.Q')
  logger() {
    console.log('Current tabs stae is ', this.tabState());
    console.log('Current Active Index ', this.activeIndex());
    console.log('Current Active Tab ', this.activeTab());
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
    if (this.activeIndex() != null && this.activeIndex()! >= 0)
      this.tabCloseOptimized({
        index: this.activeIndex(),
      } as TabViewCloseEvent);
  }

  /**
   * All things needs to be done to create a new tab
   */
  newTabActions(
    id: number,
    new_path: string,
    file_name: string,
    isNewTab: boolean,
  ): Tab {
    let tab: Tab = {
      ...NEW_TAB_DEFAULT,
      id: id,
      title: file_name,
      path: new_path,
      isNewTab: isNewTab,
    };
    this.activeTabChangeActions(tab);
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
  activeTabChangeActions(tab: Tab) {
    let config: WorkpadState = {
      activeWorkingDirectory: this.workpadState().activeWorkingDirectory,
      activeWorkingFileName: tab.title,
      activeWorkpadFilePath: tab.path,
    };
    this.store.dispatch(updateWorkpadConfig({ workpadState: config }));
  }

  tabCloseOptimized(event: TabViewCloseEvent) {
    this.store.dispatch(closeTab({ id: event.index }));
    console.log('Tab Closed event called ', event);
  }

  /**
   * This handles the tabs close event.
   * Scenarios -> Current Active tabs is closed , non-active tab is closed , last tab is closed
   * @param event TabViewCloseEvent
   */
  tabClose(event: TabViewCloseEvent) {
    this.store.dispatch(closeTab({id:event.index}))
    this.activeTabChangeActions(this.activeTab()!);
  }


  /**
   * Handles tabs change Event
   * @param index
   */
  handleTabIndexChange(index: number) {
    if (!this.wasTabClosed) {
      let tab = this.store.selectSignal(selectTabById(index))()
      this.activeTabChangeActions(tab!);
      this.store.dispatch(currentTabChanged({ tab:tab! }));
    }
    this.wasTabClosed = false;
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
