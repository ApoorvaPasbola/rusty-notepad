import {
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizerDirective } from '../../directives/resizer/resizer.directive';

@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, FormsModule, ResizerDirective],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})

export class WorkpadComponent {
  work: string = '';

}
