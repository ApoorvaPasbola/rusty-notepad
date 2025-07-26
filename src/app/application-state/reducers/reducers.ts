import { createReducer, on } from '@ngrx/store';
import { add, clear, remove, updateAll } from '../actions/actions';
import { ApplicationState } from '..';
import { NEVER } from 'rxjs';

export const initialState: ApplicationState = {
    tabs: [],
    currentTab: null,
};

export const applicationReducer = createReducer(
    initialState,
    on(add, (state, { tab }) => ({
        ...state,
        tabs: [...state.tabs, tab],
    })),
    on(remove, (state, { tab }) => ({
        ...state,
        tabs: state.tabs.filter((p) => tab.id != p.id),
    })),
    on(updateAll, (state, { tab }) => ({
        ...state,
        tab,
    })),
    on(clear, () => initialState),
);
