import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScriptPageModule} from './script-page/script.page.module';
import {ApiConfig} from './app.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    BrowserAnimationsModule,
    ScriptPageModule,
  ],
  providers: [
    ApiConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
