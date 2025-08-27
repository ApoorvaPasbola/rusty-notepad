import { Component, computed, HostListener, Signal } from '@angular/core';
import { TabViewCloseEvent, TabViewModule } from 'primeng/tabview';
import { CommonModule, KeyValue, NgFor, NgIf } from '@angular/common';
import { Tab } from '../../utilities/interfaces/Tab';
import { NEW_TAB_DEFAULT } from '../../utilities/Constants';
import { AppEvents, NotepadEvents } from '../../utilities/interfaces/Events';
import { filter } from 'rxjs';
import { RustyStateService } from '../../services/rusty/rusty-state.service';
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
  setCurrentTabTo,
} from '../../../state/actions/actions';
import { TabState, WorkpadState } from '../../../state';
import {
  buildNewTab,
} from '../../utilities/helper-functions/tab-creator-util';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, TabViewModule, NgFor, NgIf],
})
export class TabsComponent {
  wasTabClosed: boolean = false;

  workpadState: Signal<WorkpadState>;

  tabState: Signal<TabState>;
  activeTab: Signal<Tab | null>;


  activeIndex = computed(() => {
    if (this.activeTab()) return this.activeTab()?.id!;
    else return null;
  });

  constructor(
    private state: RustyStateService,
    private store: Store,
  ) {
    this.tabState = this.store.selectSignal(selectAppState);
    this.activeTab = this.store.selectSignal(currentTab);
    this.workpadState = this.store.selectSignal(workpadState);
    this.state.notepadEvents$
      .pipe(filter((event) => event.type === AppEvents.TAB_CREATE))
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

  newTab(tabEvent: NotepadEvents) {
    if (!tabEvent.file_name || !tabEvent.path) {
      this.createBlankTab();
      return;
    }

    let openedTab: Tab | undefined = this.tabState().tabs.find(
      (t) => t.path === tabEvent.path && t.title === tabEvent.file_name,
    );

    if (openedTab) {
      this.store.dispatch(setCurrentTabTo({ tab: openedTab }));
      return;
    }

    let tab: Tab = {
      ...NEW_TAB_DEFAULT,
      id: this.tabState().tabs.length,
      path: tabEvent.path,
      title: tabEvent.file_name,
      isNewTab: false,
    };
    this.store.dispatch(add({ tab }));
  }

  /**
   * New Tab on Ctrl + N
   */
  @HostListener('document:keydown.control.N')
  createBlankTab() {
    let tab = buildNewTab(
      this.tabState().tabs.length,
      this.workpadState().activeWorkingDirectory!,
    );
    this.store.dispatch(add({ tab }));
  }

  @HostListener('document:keydown.control.Q')
  logger() {
    console.log('Current tabs stae is ', this.tabState());
    console.log('Current Active Index ', this.activeIndex());
    console.log('Current Active Tab ', this.activeTab());
  }
  
  @HostListener('document:keydown.control.Tab')
  changeTab() {
    if (this.activeIndex() != null && this.activeIndex()! >= 0) {
      let newTabIndex = (this.activeIndex()! + 1) % this.tabState().tabs.length;
      let tab = this.store.selectSignal(selectTabById(newTabIndex))();
     this.store.dispatch(setCurrentTabTo({ tab: tab! }));
    }
  }

  /**
   * Listner to close the active tab
   */
  @HostListener('document:keydown.control.W')
  closeTab() {
    if (this.activeIndex() != null && this.activeIndex()! >= 0)
      this.tabClose({
        index: this.activeIndex(),
      } as TabViewCloseEvent);
  }

  tabClose(event: TabViewCloseEvent) {
    this.store.dispatch(closeTab({ id: event.index }));
  }

  /**
   * Handles tabs change Event
   * @param index
   */
  handleTabIndexChange(index: number) {
    if (!this.wasTabClosed) {
      let tab = this.store.selectSignal(selectTabById(index))();
      this.store.dispatch(setCurrentTabTo({ tab: tab! }));
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
