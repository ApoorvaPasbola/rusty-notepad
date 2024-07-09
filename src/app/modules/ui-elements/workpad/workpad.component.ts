import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizerDirective } from '../../directives/resizer/resizer.directive';

@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, FormsModule, ResizerDirective, NgFor],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})

export class WorkpadComponent implements OnInit {

  @ViewChild("editorContainer", { static: true })
  editorContainer: ElementRef | null = null;



  ngOnInit(): void {

  }

  getEditorContent() {

  }
  formatText(command:any, value = undefined) {
    document.execCommand(command, false, value);
  }
  createLink(){

  }



}
