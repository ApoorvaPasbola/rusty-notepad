import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RustyViewComponent } from './modules/ui-elements/rusty-view/rusty-view.component';
import { StoreModule } from '@ngrx/store';
import { tabReducer } from './state/reducers/tabs-state-reducers';
import {providePrimeNG} from "primeng/config";
import Lara from '@primeuix/themes/lara';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RustyViewComponent,
    StoreModule.forRoot({TabState:tabReducer}),
  ],
  providers: [
    providePrimeNG({
      theme: {
        preset: Lara,
        options:{
          darkModeSelector: '.p-dark'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
