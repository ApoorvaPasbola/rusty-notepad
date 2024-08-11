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
import { EditorInitEvent, EditorModule } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import Quill from 'quill';
import { SaveFileEvent } from '../../utilities/interfaces/Events';
import { Delta } from 'quill/core';
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

  @Output() saveFileEvent = new EventEmitter<SaveFileEvent>();

  /**
   * Quill Editor object to access the internal apis
   */
  private quill!: Quill;

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
        this.quill.setContents(delta);
      } catch (error) {
        this.quill.setText(this.contentFromFile);
      }
    }
  }

  /**
   * To emit the current content to the rusty-view to save.
   */
  @HostListener('document:keydown.control.S')
  getCurrentDraf() {
    if (this.quill) this.saveFileEvent.emit({ data: this.quill.getText() });
    return this.saveFileEvent.emit({ data: undefined });
  }

  /**
   * To emit the current content to the rusty-view to save.
   */
  @HostListener('document:keydown.alt.S')
  getCurrentDrafHtml() {
    if (this.quill)
      this.saveFileEvent.emit({
        data: JSON.stringify(this.quill.getContents()),
      });
    return this.saveFileEvent.emit({ data: undefined });
  }
}
