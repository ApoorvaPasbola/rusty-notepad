import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { Tab } from '../modules/utilities/interfaces/Tab';

export interface ApplicationState {
  tabs:Tab[];
  currentTab: Tab | null;
}

// export const reducers: ActionReducerMap<ApplicationState> = {

// };


// export const metaReducers: MetaReducer<ApplicationState>[] = isDevMode() ? [] : [];
