import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { EditorInitEvent, EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import Quill from 'quill';
import { FileEvents, FileEventType } from '../../utilities/interfaces/Events';
import { Delta } from 'quill/core';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, NgStyle],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})
export class WorkpadComponent implements OnChanges {

  /**
   * Takes input string from tabs . Which reads data from the file
   */
  @Input('contentFromFile') contentFromFile!: string;

  @Output() saveFileEvent = new EventEmitter<FileEvents>();

  supportsQuill: boolean = false;

  contentChange$ = new Subject<string>();

  /**
   * Quill Editor object to access the internal apis
   */
  private quill!: Quill;

  constructor(){
    this.contentChange$.pipe(debounceTime(1000)).subscribe((event) => this.isQuillDocument(event))
  }

  /**
   * Toggle to enable/disable header toolbar
   */
  showHeader: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.loadDataFromFile();
  }

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
        delta = new Delta(JSON.parse(this.contentFromFile));
        if (!delta.ops.length) {
          throw new Error("Not a Quill Object ");
        }
        console.debug("Loading Quill Object ");

        this.supportsQuill = true;
        this.quill.setContents(delta);
      } catch (error) {
        console.debug("Loading normal text Object");

        this.quill.setText(this.contentFromFile);
        this.supportsQuill = false;
      }
    }
  }

  /**
   * To emit the current content to the rusty-view to save.
   */
  @HostListener('document:keydown.control.S')
  getCurrentDraf() {
    if (this.quill) {
      if (this.supportsQuill) {
        console.debug("Saving quill Supported Content ");
        return this.saveFileEvent.emit({ data: JSON.stringify(this.quill.getContents()), type: FileEventType.SAVE });
      }
      else {
        console.debug("Saving Normal Text Content");
        return this.saveFileEvent.emit({ data: this.quill.getText(), type: FileEventType.SAVE });
      }
    }
    return this.saveFileEvent.emit({ data: undefined, type: FileEventType.SAVE });
  }

  isQuillDocument(event: string) {
    if (event.match(new RegExp('<(ol|em|strong|li|u)\\b[^>]*>.*?</\\1>'))) {
      this.supportsQuill = true
    }
    else {
      this.supportsQuill = false
    }
  }

  handleContentChange(event:EditorTextChangeEvent){
    this.contentChange$.next(event.htmlValue);
  }

}
