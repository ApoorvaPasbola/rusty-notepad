import {
  Component,
  Renderer2,
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

export class WorkpadComponent {
  work: string = '';
  constructor(private renderer: Renderer2) {
  }

  resize(textArea: HTMLTextAreaElement) {
      textArea.style.height = 'auto'
      textArea.style.height = (textArea.scrollHeight) + 'px';
  }
}
