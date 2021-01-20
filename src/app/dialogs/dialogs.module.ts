import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { TextInputDialogComponent } from './text-input-dialog/text-input-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    ConfirmDialogComponent,
    TextInputDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ]
})
export class DialogsModule { }
