import { createAction, props } from "@ngrx/store";
import { Tab } from "../../modules/utilities/interfaces/Tab";
import { WorkpadState } from "..";



// TABS Action 
const NEW_TAB_EVENT = '[ApplicationState] Add New Tab';
export const add = createAction(NEW_TAB_EVENT,props<{tab:Tab}>());

const TITLE_UPDATED_TAB_EVENT = '[ApplicationState] Add New Tab';
export const tittleChanged = createAction(TITLE_UPDATED_TAB_EVENT,props<{tab:Tab}>());

const UPDATE_CURRENT_TAB_EVENT = '[ApplicationState] Update Current Tab';
export const setCurrentTabTo = createAction(UPDATE_CURRENT_TAB_EVENT,props<{tab:Tab}>());

const CLOSE_TAB_EVENT = '[ApplicationState] Remove Tab';
export const closeTab = createAction(CLOSE_TAB_EVENT,props<{id:number}>());

const UPDATE_ALL_TABS_EVENT = '[ApplicationState] Update All Tabs';
export const updateAll = createAction(UPDATE_ALL_TABS_EVENT,props<{tab:Tab[]}>());

const CLEAR_TABS_STATE_EVENT = '[ApplicationState] Clear All Tabs';
export const clear = createAction(CLEAR_TABS_STATE_EVENT);


// Workpad Actions 
const UPDATE_WORKPAD_CONFIG_EVENT = '[ApplicationState] Update All Tabs';
export const updateWorkpadConfig = createAction(UPDATE_WORKPAD_CONFIG_EVENT,props<{workpadState:WorkpadState}>());

export const updateTabData = createAction("[ApplicationState] Update current tab with data",props<{data:string}>())