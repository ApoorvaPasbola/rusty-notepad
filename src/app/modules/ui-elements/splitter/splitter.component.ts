import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
@Component({
  selector: 'app-splitter',
  templateUrl: './splitter.component.html',
  styleUrl: './splitter.component.scss',
  standalone: true,
  imports: [SplitterModule]
})
export class SplitterComponent {

}
