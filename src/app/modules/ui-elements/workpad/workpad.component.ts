import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizerDirective } from '../../directives/resizer/resizer.directive';
import { HorizontalBarComponent } from "../horizontal-bar/horizontal-bar.component";
import { TooltipComponent } from '../tooltip/tooltip.component';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';

@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [CommonModule, FormsModule, ResizerDirective, NgFor, TooltipDirective],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})

export class WorkpadComponent  {


  formatText(command:any, value = undefined) {
    document.execCommand(command, false, value);
  }
  createLink(){

  }



}
