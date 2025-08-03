import { createFeatureSelector } from "@ngrx/store";
import { RustyEvents } from "..";


export const selectAppState = createFeatureSelector<RustyEvents>('RustyEvents');
