import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'rusty-landing-page',
  imports: [NgTemplateOutlet],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  @Input('commands')
  commands!: { discription: string; keys: { key: string; alpha: string } }[];

  @Input('showIcon')
  icon: boolean = false;
}
