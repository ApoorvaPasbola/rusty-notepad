import { Component, Input } from '@angular/core';
@Component({
  selector: 'rusty-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  standalone: true,
  imports: [],
})
export class TabComponent {
  @Input('tab')
  tab!: {
    id: number;
    content: string;
    title: string;
    isClosable: boolean;
    selected: boolean;
  };
}
