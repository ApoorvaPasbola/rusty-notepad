import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizerDirective } from '../../directives/resizer/resizer.directive';
import Quill from 'quill';

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

  quill: Quill | undefined


  ngOnInit(): void {
    if (this.editorContainer) {
      this.quill = new Quill(this.editorContainer.nativeElement, {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ["clean"],
          ],
        },
        theme: "snow"
      });
    }
  }

  getEditorContent() {
    if (!this.quill)
      return "";
    return this.quill?.root.innerHTML;
  }

}
