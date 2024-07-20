import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResizerDirective } from '../../directives/resizer/resizer.directive';
import { TooltipDirective } from '../../directives/tooltip/tooltip.directive';
import { ContentEditableModelDirective } from '../../directives/contentEditableModel/content-editable-model.directive';

@Component({
  selector: 'app-workpad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ResizerDirective,
    NgFor,
    TooltipDirective,
    ContentEditableModelDirective
  ],
  templateUrl: './workpad.component.html',
  styleUrl: './workpad.component.scss',
})
export class WorkpadComponent implements OnInit {

  @Input('contentFromFile')
  contentFromFile: string | undefined;

  work: string = '';
  ngOnInit(): void {
    if (this.contentFromFile) this.work = this.contentFromFile;
  }

}
