import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})

export class WorkpadComponent implements AfterViewInit {
  work: string = '';
  @ViewChild('textarea') private textareaElement!:ElementRef<HTMLTextAreaElement>
  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.listen(this.textareaElement.nativeElement, "keyup", () => this.autoGrow())
  }


  autoGrow() {
    let { scrollHeight, clientHeight} = this.textareaElement.nativeElement
    if (scrollHeight > clientHeight) {
      this.renderer.setStyle(this.textareaElement.nativeElement, "height", `${scrollHeight}px`)
    }
  }
}
