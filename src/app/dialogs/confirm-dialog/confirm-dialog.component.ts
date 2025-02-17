import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

interface IConfirmDialogData {
  title?: string;
  text?: string;
}

/**
 * Dialog template with "OK" and "Cancel" buttons
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: IConfirmDialogData
  ) {}

}
