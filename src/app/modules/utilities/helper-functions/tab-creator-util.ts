import { NEW_TAB_DEFAULT } from "../Constants";
import { v4 as uuid4 } from 'uuid';
import { Tab } from "../interfaces/Tab";

/**
   * Generates a randon path which is unique and a new title for the new tab
   * @returns returns the path and title for a new tab
   */
  export function getNewTabConfig(draftNotesSize:number, activeWorkingDirectory:string): Tab {
    let title = `${NEW_TAB_DEFAULT.title} (${draftNotesSize + 1})`;
    let path = `${activeWorkingDirectory}/${uuid4()}`;
    return { path, title } as Tab;
  }

   export function buildNewTab(id:number, activeWorkingDirectory:string): Tab {
    let title = `${NEW_TAB_DEFAULT.title} (${id + 1})`;
    let path = `${activeWorkingDirectory}/${uuid4()}`;
    return { path, title ,id} as Tab;
  }