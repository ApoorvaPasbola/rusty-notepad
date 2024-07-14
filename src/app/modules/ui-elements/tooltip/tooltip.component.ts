import { Component } from '@angular/core';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
  standalone: true,
  imports: []
})
export class TooltipComponent {
  tooltip = "Tooltip is working!!";
  left:number = 0;
  top:number = 0;
}
