import { createReducer, on, select } from '@ngrx/store';
import {
  add,
  clear,
  closeTab,
  setCurrentTabTo,
  tittleChanged,
  updateTabData,
  updateWorkpadConfig,
} from '../actions/actions';
import { TabState } from '..';
import { Tab } from '../../modules/utilities/interfaces/Tab';

export const initialState: TabState = {
  tabs: [],
  currentTab: null,
  workpadState: {
    activeWorkingDirectory: undefined,
    activeWorkpadFilePath: undefined,
    activeWorkingFileName: undefined,
  },
};

// TABS Reducers
export const tabReducer = createReducer(
  initialState,
  on(add, (state, { tab }) => addNewTab(state, tab)),
  on(closeTab, (state, { id }) => closeTabReducer(state, id)),
  on(clear, () => initialState),
  on(tittleChanged, (state, { tab }) => tittleChangedReducer(state, tab)),
  on(setCurrentTabTo, (state, { tab }) => updateCurrentTab(state, tab)),
  on(updateWorkpadConfig, (state, { workpadState }) =>
    updateWorkpadConfigReducer(state, workpadState),
  ),
  on(updateTabData, (state, { data }) => updateTabDataReducer(state, data)),
);

// Modular reducer functions

function closeTabReducer(state: TabState, id: number): TabState {
  let tab = { ...getNewTab(state, id), selected: true } as Tab | null;
  if(!tab?.id){
    return {
      currentTab: null,
      workpadState: {
        ...state.workpadState,
        activeWorkingFileName: undefined,
        activeWorkpadFilePath: undefined,
      },
      tabs: [],
    };
  }
  let tabs = state.tabs.filter((tab) => tab.id !== id);
  tabs = tabs.map((t) => {
    if (t.id === tab?.id) return { ...t, selected: true } as Tab;
    else return t;
  });
  return {
    currentTab: tab,
    workpadState: {
      ...state.workpadState,
      activeWorkingFileName: tab?.title,
      activeWorkpadFilePath: tab?.path,
    },
    tabs: tabs,
  };
}

function tittleChangedReducer(state: TabState, updatedTab: Tab): TabState {
  return {
    ...state,
    tabs: state.tabs.map((tab) =>
      tab.id === updatedTab.id ? updatedTab : tab,
    ),
  };
}

function updateTabDataReducer(state: TabState, data: any): TabState {
  if (!state.currentTab) return state;
  return {
    ...state,
    currentTab: { ...state.currentTab, content: data },
  };
}

function updateWorkpadConfigReducer(
  state: TabState,
  workpadState: TabState['workpadState'],
): TabState {
  return {
    ...state,
    workpadState,
  };
}

function updateCurrentTab(state: TabState, newCurrentTab: Tab): TabState {
  newCurrentTab = { ...newCurrentTab, selected: true } as Tab;
  return {
    ...state,
    workpadState: {
      ...state.workpadState,
      activeWorkingFileName: newCurrentTab.title,
      activeWorkpadFilePath: newCurrentTab.path,
    },
    tabs: state.tabs.map((t) => {
      if (t.id === state.currentTab?.id) {
        return { ...t, selected: false };
      } else if (t.id === newCurrentTab.id) {
        return { ...t, selected: true };
      } else return t;
    }),
    currentTab: newCurrentTab,
  };
}

function addNewTab(state: TabState, tab: Tab): TabState {
  let oldTab = state.currentTab;

  if (!tabAlreadOpened(state, tab)) {
    let newTabs = [...state.tabs, tab];
    newTabs = newTabs.map((t) => {
      if (t.id === oldTab?.id) return { ...t, selected: false } as Tab;
      else return t;
    });
    return {
      currentTab: tab,
      tabs: newTabs,
      workpadState: {
        ...state.workpadState,
        activeWorkingFileName: tab.title,
        activeWorkpadFilePath: tab.path,
      },
    };
  } else {
    return {
      ...state,
      currentTab: state.tabs.filter((t) => t.path === tab.path)[0],
      workpadState: {
        ...state.workpadState,
        activeWorkingFileName: tab.title,
        activeWorkpadFilePath: tab.path,
      },
    };
  }
}
function tabAlreadOpened(state: TabState, tab: Tab): boolean {
  return state.tabs.find((t: Tab) => t.path === tab.path) ? true : false;
}

function getNewTab(state: TabState, id: number): Tab | null {
  if (state.tabs.length == 1) return null;
  let newId = id > 0 ? id - 1 : 0;
  if (id === state.currentTab?.id)
    return state.tabs.filter((t) => t.id === newId)[0];
  return state.currentTab;
}
