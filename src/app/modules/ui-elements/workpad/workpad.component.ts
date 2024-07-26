import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from 'primeng/editor';
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
  @Input('contentFromFile') contentFromFile: string | undefined;

  /**
   * Current draft work in progress
   */
  work: string = '';

  showHeader: boolean = false;

  ngOnInit(): void {
    if (this.contentFromFile) this.work = this.contentFromFile;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.work = changes['contentFromFile'].currentValue;
  }
}
