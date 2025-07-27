import { createReducer, on } from '@ngrx/store';
import { add, clear, closeTab, currentTabChanged, tittleChanged, updateAll, updateWorkpadConfig } from '../actions/actions';
import { TabState } from '..';
import { Tab } from '../../modules/utilities/interfaces/Tab';

export const initialState: TabState = {
    tabs: [],
    currentTab: null,
    workpadState: {
        activeWorkingDirectory: undefined,
        activeWorkpadFilePath: undefined,
        activeWorkingFileName: undefined,
    }
};

// TABS Reducers 
export const tabReducer = createReducer(
    initialState,
    on(add, (state, { tab }) => (addNewTab(state, tab))),
    on(closeTab, (state, { id }) => ({
        ...state,
        currentTab: getNewTab(state, id),
        tabs: state.tabs.filter((p) => id != p.id),
    })),
    on(clear, () => initialState),
    on(tittleChanged, (state, { tab }) => ({
        ...state,
        tabs: state.tabs.map(t => {
            if (t.id === tab.id) return tab
            else return t;
        }),
    })),
    on(currentTabChanged, (state, { tab }) => (updateOldTabInactive(state, tab))),
    on(updateWorkpadConfig, (state, { workpadState }) => ({ ...state, workpadState }))
);

function updateOldTabInactive(state: TabState, tab: Tab): TabState {
    return {
        ...state,
        tabs: state.tabs.map((t) => {
            if (t.id === state.currentTab?.id) {
                return { ...t, selected: false }
            }
            else return t;
        }),
        currentTab: tab
    }
}

function addNewTab(state: TabState, tab: Tab): TabState {
    let oldTab = state.currentTab;
    
    if (!tabAlreadOpened(state, tab)) {
        let newTabs = [...state.tabs, tab];
        newTabs = newTabs.map((t) => {
            if (t.id === oldTab?.id)
                return { ...t, selected: false } as Tab;
            else return t;
        });
        return {
            ...state,
            currentTab: tab,
            tabs: newTabs,
        }
    } else {
        return {...state, currentTab: state.tabs.filter(t=>t.path===tab.path)[0]}
    }
}
function tabAlreadOpened(state: TabState, tab: Tab): boolean {
    return state.tabs.find((t: Tab) => t.path === tab.path) ? true : false;

}

function getNewTab(state: TabState, id: number): Tab | null {
    if (state.tabs.length == 1)
        return null;
    let newId = id > 0 ? id - 1 : 0;
    if (id === state.currentTab?.id)
        return state.tabs.filter(t => t.id === newId)[0]
    return state.currentTab;
}
