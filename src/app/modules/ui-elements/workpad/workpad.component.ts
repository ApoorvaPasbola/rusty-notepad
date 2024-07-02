import {
  Component,
  ElementRef,
  HostListener,
  Signal,
  ViewChild,
  signal,
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

export class WorkpadComponent {

  rows:number = 1
  
  @ViewChild("textarea") textarea!: ElementRef<HTMLTextAreaElement>
  @HostListener("input") onInput() {
      this.rows = this.textarea.nativeElement.value.split("\n").length;
  }

  
  
  work: string = '';

}
