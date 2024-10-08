import {
  Component,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { EditorInitEvent, EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import Quill from 'quill';
import { Delta } from 'quill/core';
import { debounceTime, filter, Subject, Subscription } from 'rxjs';
import { AppEvents } from '../../utilities/interfaces/Events';
import { save } from '@tauri-apps/api/dialog';
import { basename } from '@tauri-apps/api/path';
import { RustyStateService } from '../../services/rusty/rusty-state.service';
@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, NgStyle],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})
export class WorkpadComponent implements OnDestroy {

  /**
   * Takes input string from tabs . Which reads data from the file
   */
  workpadContent!: string;
  workpadContent$: Subscription;

  supportsQuill: boolean = false;

  contentChange$ = new Subject<string>();
  contentChangeSubscription!: Subscription;
  notepadSubs: Subscription;

  /**
   * Quill Editor object to access the internal apis
   */
  private quill!: Quill;

  constructor(private state: RustyStateService) {
    this.workpadContent$ = this.state.currentWorkbookContent$.subscribe(value => this.workpadContent = value);
    this.contentChangeSubscription = this.contentChange$.pipe(debounceTime(1000)).subscribe((event) => this.isQuillDocument(event))
    this.notepadSubs = this.state.notepadEvents$.pipe(
      filter(event =>
        event.type == AppEvents.WORKPAD_SAVE_REQUEST ||
        event.type == AppEvents.WORKPAD_SAVE_RESPONSE ||
        event.type == AppEvents.WORKPAD_UPDATE
      )).subscribe((event) => {

        if (event.type == AppEvents.WORKPAD_UPDATE) {
          this.loadDataFromFile();
        }
        else if (event.type == AppEvents.WORKPAD_SAVE_RESPONSE) {
          // TODO: This needs to handle UI pop with save successfull or failed. The data contains the response from the backend or service
          console.debug("Event data ", event.data);
        }
      })
  }

  ngOnDestroy() {
    this.contentChangeSubscription.unsubscribe();
    this.notepadSubs.unsubscribe();
    this.workpadContent$.unsubscribe();
  }

  /**
   * Toggle to enable/disable header toolbar
   */
  showHeader: boolean = false;


  /**
   * Triggered when the Quill Editor is initialiezed
   */
  initializeEditor(event: EditorInitEvent) {
    this.quill = event.editor;
    this.loadDataFromFile();
  }

  /**
   * Loads the data in the workpad form file
   */
  loadDataFromFile() {
    if (this.quill) {
      let delta;
      try {
        delta = new Delta(JSON.parse(this.workpadContent));
        if (!delta.ops.length) {
          throw new Error("Not a Quill Object ");
        }
        console.debug("Loading Quill Object ");

        this.supportsQuill = true;
        this.quill.setContents(delta);
      } catch (error) {
        console.debug("Loading normal text Object");

        this.quill.setText(this.workpadContent);
        this.supportsQuill = false;
      }
    }
  }

  /**
   * To emit the current content to the rusty-view to save.
   */
  @HostListener('document:keydown.control.S')
  startSaveCurrentDraft() {
    let currentWorkpadPath: string | undefined = this.state.currentWorkpadFilePath();
    if (!currentWorkpadPath || currentWorkpadPath.endsWith(".")) {
      save({defaultPath: this.state.currentWorkingDirectory(), filters:[{name: "All Files (*)", extensions:["*"]}]}).then(
        (path) => {
          if (path) {
            this.state.currentWorkpadFilePath.set(path);
            basename(path).then(file_name=> {
              this.state.currentWorkingFileName.set(file_name);
              this.saveDraft();
            });
            
          } else console.info('Recevied Null path', path);
        },
        (_) => {
          console.error(_);
        },
      );
    } else {
      this.saveDraft();
    }

  }

  saveDraft() {
    if (this.quill) {
      if (this.supportsQuill) {
        console.debug("Saving quill Supported Content ");
        return this.state.notepadEvents$.next({ data: JSON.stringify(this.quill.getContents()), type: AppEvents.WORKPAD_SAVE_REQUEST });
      }
      else {
        console.debug("Saving Normal Text Content");
        return this.state.notepadEvents$.next({ data: this.quill.getText(), type: AppEvents.WORKPAD_SAVE_REQUEST });
      }
    }
    return this.state.notepadEvents$.next({ data: undefined, type: AppEvents.WORKPAD_SAVE_REQUEST });
  }

  async getNewFilePathFromUser(): Promise<string | null> {
    const path = await save();
    return path;
  }

  /**
   * This checks if we have used the quill features as in bullets , numbering , text formatting and all to toggle between
   * a normal and a quill type file before saving.
   * @param event HTML as string from the quill Docuemnt .
   */
  isQuillDocument(event: string) {
    if (event.match(new RegExp('<(ol|em|strong|li|u)\\b[^>]*>.*?</\\1>'))) {
      this.supportsQuill = true
    }
    else {
      this.supportsQuill = false
    }
  }
  /**
   * This is a listner to the workpad changes and debounces the changes before finally calling isQuillDocument
   * @param event takes in the Quill EditorTextChangeEvent
   */
  handleContentChange(event: EditorTextChangeEvent) {
    this.contentChange$.next(event.htmlValue);
  }

}
