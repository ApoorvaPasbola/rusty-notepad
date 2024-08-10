import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule, EditorTextChangeEvent } from 'primeng/editor';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, EditorModule, FormsModule],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})
export class WorkpadComponent implements OnInit, OnChanges {

  /**
   * Takes input string from tabs . Which reads data from the file
   */
  @Input('contentFromFile') contentFromFile: String | undefined;


  /**
   * Current draft work in progress
   */
  work: String = '';

  showHeader: boolean = false;

  ngOnInit(): void {
    if (this.contentFromFile) this.work = this.contentFromFile;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.work = changes['contentFromFile'].currentValue;
  }
}
