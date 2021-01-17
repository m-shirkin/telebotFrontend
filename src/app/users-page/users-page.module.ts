import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { UsersPageComponent } from './users-page/users-page.component';
import { UsersTableComponent } from './users-table/users-table.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [UsersPageComponent, UsersTableComponent],
  exports: [
    UsersPageComponent
  ],
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ]
})
export class UsersPageModule {
}
