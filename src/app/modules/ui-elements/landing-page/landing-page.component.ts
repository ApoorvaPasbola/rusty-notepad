import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'rusty-landing-page',
  standalone: true,
  imports: [NgFor],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  commands: { discription: string, keys: { key: string, alpha: string } }[] = [
    {
      discription: "New Tab",
      keys: { key: 'Ctrl', alpha: 'N' }
    },
    {
      discription: "Close Tab",
      keys: { key: 'Ctrl', alpha: 'W' }
    },
    {
      discription: "Open Directory",
      keys: { key: 'Ctrl', alpha: 'O' }
    }
  ]
}
