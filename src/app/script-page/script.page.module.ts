import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScriptPageComponent } from './script-page/script-page.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import {CodeEditorModule} from '@ngstack/code-editor';
import {FileApiService} from './services/file-api.service';
import {HttpClientModule} from '@angular/common/http';
import { FileListComponent } from './file-list/file-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';



@NgModule({
  declarations: [ScriptPageComponent, CodeEditorComponent, FileListComponent],
  exports: [
    ScriptPageComponent
  ],
  imports: [
    CodeEditorModule.forRoot({
      baseUrl: 'assets/monaco',
      typingsWorkerUrl: 'assets/workers/typings-worker.js',
    }),
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatTabsModule,
  ],
  providers: [
    FileApiService
  ]
})
export class ScriptPageModule {}
