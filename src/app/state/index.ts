import { Tab } from '../modules/utilities/interfaces/Tab';

// New tab creation and close events 
export interface TabState {
  tabs: Tab[];
  currentTab: Tab | null;
  workpadState: WorkpadState
}

// Handles current working directory states
export interface CurrentWorkpadState {
  currentTab: Tab | null;
  workpadState: WorkpadState
}

export interface RustyEvents {
  file_name?: string,
  path?: string | undefined,
  data?: string
  type: string
}

export interface WorkpadState {
  activeWorkingDirectory: string | undefined;
  activeWorkpadFilePath: string | undefined;
  activeWorkingFileName: string | undefined;
}