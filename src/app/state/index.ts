import { Tab } from '../modules/utilities/interfaces/Tab';

export interface TabState {
  tabs:Tab[];
  currentTab: Tab | null;
  workpadState: WorkpadState
}

export interface WorkpadState {
  activeWorkingDirectory:string | undefined;
  activeWorkpadFilePath:string | undefined;
  activeWorkingFileName:string | undefined;
}