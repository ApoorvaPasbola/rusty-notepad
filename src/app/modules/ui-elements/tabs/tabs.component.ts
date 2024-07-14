import { Component } from '@angular/core';
import { HorizontalBarComponent } from '../horizontal-bar/horizontal-bar.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [HorizontalBarComponent]
})
export class TabsComponent {

}
