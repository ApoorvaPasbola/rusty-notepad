import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkpadStateService {

  /**
   * Current Workpad File Path which have metadata which can be used in other components 
   */
  currentWorkpadFilePath = signal<string | undefined>(undefined);

  /**
   * Current Working File Name which have metadata which can be used in other components 
   */
  currentWorkingFileName = signal<string | undefined>(undefined);

  /**
   * Contents of the current opened file. 
   */
  currentWorkbookContent$ = new BehaviorSubject<string>(
    'This is some default \n work from an file',
  );


  constructor() { }
}
