import {
  Component,
  HostListener,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule, NgStyle],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})
export class WorkpadComponent {
  /**
   * Takes input string from tabs . Which reads data from the file
   */
  @Input('contentFromFile') contentFromFile!: string;

  /**
   * Current draft work in progress
   */
  workpadContent: string = '';
  draft!: string;

  showHeader: boolean = false;

  ngOnInit(): void {
    this.workpadContent = this.contentFromFile;
    this.draft = this.contentFromFile;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.workpadContent = changes['contentFromFile'].currentValue;
  }

  handleChange(event: EditorTextChangeEvent) {
    console.log('Event on text change ', event);
    this.draft = event.textValue;
  }

  @HostListener('document:keydown.control.S')
  printCurrentValue() {
    console.log('Current value is ', this.draft);
  }
}
