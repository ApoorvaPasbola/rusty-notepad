import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { TabsBarComponent } from './tabs-bar/tabs-bar.component';
import { ToolbarComponent } from './toolbar.component';
import { HorizontalBarComponent } from '../ui-elements/horizontal-bar/horizontal-bar.component';



@NgModule({
  declarations: [
    MenuBarComponent,
    TabsBarComponent,
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    HorizontalBarComponent
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule { }
