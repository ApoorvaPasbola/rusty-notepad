import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ApplicationState } from "..";
import { Tab } from "../../modules/utilities/interfaces/Tab";

// Get complete state of the favorites products in application
export const selectAppState = createFeatureSelector<ApplicationState>('applicationState');

// get All favorites products
export const selectAllTabs = createSelector(
    selectAppState,
    (state: ApplicationState) => state.tabs
);

// get One favorite product by ID
export const selectProductById = (id: number) => createSelector(
    selectAllTabs,
    (tabs: Tab[]) =>
        tabs.find(tab => tab.id === id)
);