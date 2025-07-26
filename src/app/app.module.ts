import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RustyViewComponent } from './modules/ui-elements/rusty-view/rusty-view.component';
import { StoreModule } from '@ngrx/store';
import { applicationReducer } from './application-state/reducers/reducers';


@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    RustyViewComponent,
    StoreModule.forRoot({applicationState:applicationReducer}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
