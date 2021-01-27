import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScriptPageComponent} from './script-page/script-page.component';
import {CodeEditorComponent} from './code-editor/code-editor.component';
import {FileApiService} from './services/file-api.service';
import {HttpClientModule} from '@angular/common/http';
import {FileListComponent} from './file-list/file-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {LocalFileCacheService} from './services/local-file-cache.service';
import {FilenameModifiedPipe} from './pipes/filename-modified.pipe';
import { FileButtonComponent } from './file-button/file-button.component';
import {MatIconModule} from '@angular/material/icon';
import { ArrayEmptyPipe } from './pipes/array-empty.pipe';
import {DialogsModule} from '../dialogs/dialogs.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    ScriptPageComponent,
    CodeEditorComponent,
    FileListComponent,
    FilenameModifiedPipe,
    FileButtonComponent,
    ArrayEmptyPipe,
  ],
  exports: [
    ScriptPageComponent
  ],
    imports: [
        CommonModule,
        HttpClientModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        DialogsModule,
        MatTooltipModule,
    ],
  providers: [
    FileApiService,
    LocalFileCacheService,
  ]
})
export class ScriptPageModule {
}
