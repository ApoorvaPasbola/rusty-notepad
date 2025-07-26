import { createAction, props } from "@ngrx/store";
import { Tab } from "../../modules/utilities/interfaces/Tab";


export const add = createAction('[ApplicationState] Add New Tab',props<{tab:Tab}>());

export const remove = createAction('[ApplicationState] Remove Tab',props<{tab:Tab}>());

export const updateAll = createAction('[ApplicationState] Update All Tabs',props<{tab:Tab[]}>());

export const clear = createAction('[ApplicationState] Clear All Tabs');