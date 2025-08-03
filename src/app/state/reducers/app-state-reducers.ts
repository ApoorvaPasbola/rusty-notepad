import { createReducer } from "@ngrx/store";
import { RustyEvents } from "..";

export const initialState: RustyEvents = {
    file_name: "",
    path: "",
    data: "",
    type: ""
};


export const appReducer = createReducer(
    initialState);