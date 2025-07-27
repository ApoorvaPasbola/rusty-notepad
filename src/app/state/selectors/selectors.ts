import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TabState } from "..";
import { Tab } from "../../modules/utilities/interfaces/Tab";



// TABS Selectors 
export const selectAppState = createFeatureSelector<TabState>('TabState');

// get All favorites products
export const selectAllTabs = createSelector(
    selectAppState,
    (state: TabState) => state.tabs
);

// get One favorite product by ID
export const selectTabById = (id: number) => createSelector(
    selectAllTabs,
    (tabs: Tab[]) =>
        tabs.find(tab => tab.id === id)
);

export const currentTab = createSelector(
    selectAppState,
    (state:TabState)=> state.currentTab
);