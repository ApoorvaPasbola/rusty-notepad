import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RustyViewComponent } from './modules/ui-elements/rusty-view/rusty-view.component';
import { TooltipComponent } from './modules/ui-elements/tooltip/tooltip.component';


@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RustyViewComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
