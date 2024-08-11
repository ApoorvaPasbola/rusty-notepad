import {
  Component,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import {
  EditorInitEvent,
  EditorModule,
} from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import Quill from 'quill';
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

  /**
   * Quill Editor object to access the internal apis
   */
  private quill!: Quill;

  /**
   * Toggle to enable/disable header toolbar
   */
  showHeader: boolean = false;


  ngOnChanges(changes: SimpleChanges): void {
    console.log("Changes occured ", changes, this.contentFromFile);
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
    if(this.quill)
      this.quill.setText(this.contentFromFile)
  }

  /**
   * This is just for debugging purposes
   */
  @HostListener('document:keydown.control.S')
  getCurrentDraf():string {
    if(this.quill)
      return this.quill.getText()
    return "";
  }
}
