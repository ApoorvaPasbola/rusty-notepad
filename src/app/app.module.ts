import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import {WorkpadComponent} from "./modules/ui-elements/workpad/workpad.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    ToolbarModule,
    WorkpadComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
