import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * Service that displays notifications on the page
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    private snackBar: MatSnackBar
  ) {}

  /**
   * Display an info notification
   * @param text: notification text
   */
  note(text: string): void {
    this.snackBar.open(text, '', {
      duration: 2000
    });
  }
}
