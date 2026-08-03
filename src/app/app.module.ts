import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RustyViewComponent } from '@features/rusty-view/rusty-view.component';
import { StoreModule } from '@ngrx/store';
import { tabReducer } from '@state/reducers/tabs-state-reducers';
import {providePrimeNG} from "primeng/config";
import Lara from '@primeuix/themes/lara';
import {ToastModule} from "primeng/toast";

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RustyViewComponent,
    ToastModule,
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
