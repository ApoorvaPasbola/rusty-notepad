import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplitterComponent } from './splitter/splitter.component';
import { HorizontalBarComponent } from './horizontal-bar/horizontal-bar.component';



@NgModule({
  declarations: [
    SplitterComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SplitterComponent
  ]
})
export class UiElementsModule { }
