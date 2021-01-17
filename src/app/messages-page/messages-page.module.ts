import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesPageComponent } from './messages-page/messages-page.component';
import { MessagesTableComponent } from './messages-table/messages-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  declarations: [MessagesPageComponent, MessagesTableComponent],
  exports: [
    MessagesPageComponent
  ],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ]
})
export class MessagesPageModule { }
