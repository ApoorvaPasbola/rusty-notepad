import { Tab } from '../modules/utilities/interfaces/Tab';

export interface TabState {
  tabs:Tab[];
  currentTab: Tab | null;
}
