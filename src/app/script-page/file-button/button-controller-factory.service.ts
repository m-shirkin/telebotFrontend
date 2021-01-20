import {Injectable} from '@angular/core';
import {LocalFileCacheService} from '../services/local-file-cache.service';
import {from} from 'rxjs';
import {concatAll} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../dialogs/confirm-dialog/confirm-dialog.component';
import {TextInputDialogComponent} from '../../dialogs/text-input-dialog/text-input-dialog.component';

export interface IButtonController {
  readonly color: string;
  readonly iconName: string;

  onClick: (e: MouseEvent) => void;
}

@Injectable({
  providedIn: 'root'
})
class SaveButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService
  ) {
  }

  readonly color = '#69ddee';
  readonly iconName = 'save';

  onClick(e: MouseEvent): void {
    this.localFileCache.pushToServer().subscribe();
  }
}

@Injectable({
  providedIn: 'root'
})
class DeleteButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private dialog: MatDialog,
  ) {
  }

  readonly color = '#f44336';
  readonly iconName = 'delete';

  onClick(e: MouseEvent): void {
    this.dialog.open(
      ConfirmDialogComponent,
      {
        data: {
          title: 'Warning',
          text: `Are you sure you want to delete "${this.localFileCache.getSelectedFile()}"?`,
        }
      }
    ).afterClosed().subscribe(
      (result: boolean): void => {
        if (result) {
          this.localFileCache.deleteSelected().subscribe();
        }
      }
    );
  }
}

@Injectable({
  providedIn: 'root'
})
class NewFileButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private dialog: MatDialog,
  ) {
  }

  readonly color = '#dddddd';
  readonly iconName = 'text_snippet';

  onClick(e: MouseEvent): void {
    this.dialog.open(
      TextInputDialogComponent,
      {
        data: {
          title: 'Create a file',
          text: 'Choose a name for the new file',
          inputData: {
            label: 'File name',
            placeholder: 'newfile.ts',
          }
        }
      }
    ).afterClosed().subscribe(
      (result: string): void => {
        if (result) {
          if (!result.match(/.*\.ts/i)) {
            result += '.ts';
          } else {
            result = result.slice(0, result.length - 3) + '.ts';
          }
          this.localFileCache.createFile(result).subscribe();
        }
      }
    );
  }
}

@Injectable({
  providedIn: 'root'
})
class RenameFileButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService,
    private dialog: MatDialog,
  ) {
  }

  readonly color = '#dddd33';
  readonly iconName = 'edit';

  onClick(e: MouseEvent): void {
    this.dialog.open(
      TextInputDialogComponent,
      {
        data: {
          title: `Rename file "${this.localFileCache.getSelectedFile()}"`,
          text: 'Choose a new name',
          inputData: {
            label: 'File name',
            placeholder: 'newfile.ts',
          }
        }
      }
    ).afterClosed().subscribe(
      (result: string): void => {
        if (result) {
          if (!result.match(/.*\.ts/i)) {
            result += '.ts';
          } else {
            result = result.slice(0, result.length - 3) + '.ts';
          }
          this.localFileCache.renameSelected(result).subscribe();
        }
      }
    );
  }
}

@Injectable({
  providedIn: 'root'
})
class RunButtonController implements IButtonController {
  constructor(
    protected localFileCache: LocalFileCacheService
  ) {
  }

  readonly color = '#69f0ae';
  readonly iconName = 'play_arrow';

  onClick(e: MouseEvent): void {
    from([
      this.localFileCache.pushToServer(),
      this.localFileCache.runSelectedFile(),
    ]).pipe(
      concatAll()
    ).subscribe();
  }
}

interface IButtonControllerLookup {
  save: SaveButtonController;
  remove: DeleteButtonController;
  run: RunButtonController;
  create: NewFileButtonController;
  rename: RenameFileButtonController;
}

export type ButtonType = keyof IButtonControllerLookup;

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
