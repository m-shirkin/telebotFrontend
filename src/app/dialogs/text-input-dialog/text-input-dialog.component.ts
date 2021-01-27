import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

interface ITextInputDialogData {
  title?: string;
  text?: string;
  inputData: {
    label?: string,
    placeholder?: string,
    value?: string,
  };
}

/**
 * Dialog template with a single text input
 */
@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.css']
})
export class TextInputDialogComponent {
  inputValue: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ITextInputDialogData
  ) {
    this.inputValue = dialogData.inputData.value || '';
  }
}
