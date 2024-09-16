import { Injectable, signal } from '@angular/core';
import { Tab } from '../../utilities/interfaces/Tab';

@Injectable({
  providedIn: 'root'
})
export class FsStateService {

  /**
   * Current Tab which have metadata which can be used in other components 
   */
  currentTab = signal<Tab | undefined>(undefined);

  /**
  * Current Working Directory which have metadata which can be used in other components 
  */
  currentWorkingDirectory = signal<string | undefined>(undefined);


  constructor() { }
}
