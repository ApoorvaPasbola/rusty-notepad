import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-splitter',
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss',
  standalone: true,
  imports: [SplitterModule, ScrollPanelModule]
})
export class SplitterComponent {
}
