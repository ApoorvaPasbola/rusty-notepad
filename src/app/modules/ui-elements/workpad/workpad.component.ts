import { Component, Input, OnInit } from '@angular/core';
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
export class WorkpadComponent implements OnInit {
  @Input('contentFromFile')
  contentFromFile: string | undefined;

  work: string = '';
  
  showHeader: boolean = false;
  ngOnInit(): void {
    if(this.contentFromFile)
      this.work = this.contentFromFile;
  }
}
