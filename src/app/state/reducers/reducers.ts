import { createReducer, on } from '@ngrx/store';
import { add, clear, closeTab, currentTabChanged, tittleChanged, updateAll } from '../actions/actions';
import { TabState } from '..';
import { state } from '@angular/animations';
import { Tab } from '../../modules/utilities/interfaces/Tab';

export const initialState: TabState = {
    tabs: [],
    currentTab: null,
};

// TABS Reducers 
export const tabReducer = createReducer(
    initialState,
    on(add, (state, { tab }) => (addNewTab(state, tab))),
    on(closeTab, (state, { id }) => ({
        currentTab: getNewTab(state, id),
        tabs: state.tabs.filter((p) => id != p.id),
    })),
    on(updateAll, (state, { tab }) => ({
        ...state,
        tab,
    })),
    on(clear, () => initialState),
    on(tittleChanged, (state, { tab }) => ({
        ...state,
        tabs: state.tabs.map(t => {
            if (t.id === tab.id) return tab
            else return t;
        }),
    })),
    on(currentTabChanged, (state, { tab }) => (updateOldTabInactive(state, tab)))
);

function updateOldTabInactive(state: TabState, tab: Tab): TabState {
    return {
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
    let newTabs = [...state.tabs, tab];
    newTabs = newTabs.map((t) => {
        if (t.id === oldTab?.id)
            return { ...t, selected: false } as Tab;
        else return t;
    });
    let ctx = {
        currentTab: tab,
        tabs: newTabs,
    }
    return ctx;
}

function getNewTab(state: TabState, id: number): Tab | null {
    if (state.tabs.length == 1)
        return null;
    let newId = id > 0 ? id - 1 : 0;
    if (id === state.currentTab?.id)
        return state.tabs.filter(t => t.id === newId)[0]
    return state.currentTab;
}
