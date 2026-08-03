import { NEW_TAB_DEFAULT } from "../Constants";
import { Tab } from "../interfaces/Tab";



   export function buildNewTab(id:number, activeWorkingDirectory:string): Tab {
    let title = `${NEW_TAB_DEFAULT.title} (${id + 1})`;
    let path = `${activeWorkingDirectory}/${crypto.randomUUID()}`;
    return { path, title ,id} as Tab;
  }
