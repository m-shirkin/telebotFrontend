import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ScriptPageModule} from './script-page/script.page.module';
import {ApiConfig} from './app.config';
import {MatButtonModule} from '@angular/material/button';
import {UsersPageModule} from './users-page/users-page.module';
import {MessagesPageModule} from './messages-page/messages-page.module';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MatTabsModule,
    BrowserAnimationsModule,
    ScriptPageModule,
    MatButtonModule,
    UsersPageModule,
    MessagesPageModule,
  ],
  providers: [
    ApiConfig
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
