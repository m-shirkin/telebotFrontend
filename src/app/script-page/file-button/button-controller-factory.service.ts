import {Injectable} from '@angular/core';
import {LocalFileCacheService} from '../services/local-file-cache.service';
import {from} from 'rxjs';
import {concatAll} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {TextInputDialogComponent} from '../../dialogs/text-input-dialog/text-input-dialog.component';
import {NotificationsService} from '../../services/notifications.service';

/**
 * Interface of a button in the files screen
 *
 * color: button color
 * iconName: name of Material icon to display
 * title: hint displayed on mouse hover
 * onClick: action performed on click
 */
export interface IButtonController {
  readonly color: string;
  readonly iconName: string;
  readonly title: string;

  onClick: (e: MouseEvent) => void;
}

/**
 * Transform filename to match a certain extension
 * @param filename: initial filename
 * @param extension: extension to possibly add
 */
const addExtension = (filename: string, extension: string): string => {
  let result: string;
  if (!filename.match(new RegExp('.*\.' + extension, 'i'))) {
    result = filename + '.' + extension;
  } else {
    result = filename.slice(0, filename.length - 3) + '.' + extension;
  }
  return result;
};

/**
 * Save all files
 */
@Injectable({
  providedIn: 'root'
})
class SaveButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private notificationsService: NotificationsService,
  ) {
  }

  readonly color = '#69ddee';
  readonly iconName = 'save';
  readonly title = 'Save all';

  onClick(e: MouseEvent): void {
    this.localFileCache.pushToServer().subscribe(
      () => {
        this.notificationsService.note('All files saved.');
      }
    );
  }
}

/**
 * Delete selected file
 */
@Injectable({
  providedIn: 'root'
})
class DeleteButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
  ) {
  }

  readonly color = '#f44336';
  readonly iconName = 'delete';
  readonly title = 'Delete file';

  onClick(e: MouseEvent): void {
    const currentFile = this.localFileCache.getSelectedFile();
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: 'Warning',
          text: `Are you sure you want to delete "${currentFile}"?`,
        }
      }
    ).afterClosed().subscribe(
      (result: boolean): void => {
        if (result) {
          this.localFileCache.deleteSelected().subscribe(
            () => {
              this.notificationsService.note(`Deleted file "${currentFile}".`);
            }
          );
        }
      }
    );
  }
}

/**
 * Create new file
 */
@Injectable({
  providedIn: 'root'
})
class NewFileButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
  ) {
  }

  readonly color = '#dddddd';
  readonly iconName = 'text_snippet';
  readonly title = 'Create a file';

  onClick(e: MouseEvent): void {
    this.dialog.open(
      TextInputDialogComponent,
      {
        data: {
          title: 'Create a file',
          text: 'Choose a name for the new file',
          inputData: {
            label: 'File name',
            placeholder: 'new.ts',
          }
        }
      }
    ).afterClosed().subscribe(
      (result: string): void => {
        if (result) {
          result = addExtension(result, 'ts');
          this.localFileCache.createFile(result).subscribe(
            () => {
              this.notificationsService.note(`Created file "${result}".`);
            }
          );
        }
      }
    );
  }
}

/**
 * Rename selected file
 */
@Injectable({
  providedIn: 'root'
})
class RenameFileButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private dialog: MatDialog,
    private notificationsService: NotificationsService,
  ) {
  }

  readonly color = '#dddd33';
  readonly iconName = 'edit';
  readonly title = 'Rename file';

  onClick(e: MouseEvent): void {
    const currentFile = this.localFileCache.getSelectedFile();
    this.dialog.open(
      TextInputDialogComponent,
      {
        data: {
          title: `Rename file "${currentFile}"`,
          text: 'Choose a new name',
          inputData: {
            label: 'File name',
            placeholder: 'new.ts',
          }
        }
      }
    ).afterClosed().subscribe(
      (result: string): void => {
        if (result) {
          result = addExtension(result, 'ts');
          this.localFileCache.renameSelected(result).subscribe(
            () => {
              this.notificationsService.note(`Renamed "${currentFile}" => "${result}"`);
            }
          );
        }
      }
    );
  }
}

/**
 * Run selected file
 */
@Injectable({
  providedIn: 'root'
})
class RunButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private notificationsService: NotificationsService,
  ) {
  }

  readonly color = '#69f0ae';
  readonly iconName = 'play_arrow';
  readonly title = 'Run file';

  onClick(e: MouseEvent): void {
    const currentFile = this.localFileCache.getSelectedFile();
    from([
      this.localFileCache.pushToServer(),
      this.localFileCache.runSelectedFile(),
    ]).pipe(
      concatAll()
    ).subscribe(() => {
      this.notificationsService.note(`File ${currentFile} is now running.`);
    });
  }
}

/**
 * Interface that matches a button type to a class
 */
interface IButtonControllerLookup {
  save: SaveButtonController;
  remove: DeleteButtonController;
  run: RunButtonController;
  create: NewFileButtonController;
  rename: RenameFileButtonController;
}

export type ButtonType = keyof IButtonControllerLookup;

/**
 * Create a factory, that can retrieve a specific controller reference, based on the type
 */
@Injectable({
  providedIn: 'root'
})
export class ButtonControllerFactory implements IButtonControllerLookup {
  constructor(
    public save: SaveButtonController,
    public remove: DeleteButtonController,
    public run: RunButtonController,
    public create: NewFileButtonController,
    public rename: RenameFileButtonController,
  ) {
  }

  getController(type: ButtonType): IButtonController {
    return this[type];
  }
}
