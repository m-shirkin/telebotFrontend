import {Injectable} from '@angular/core';
import {LocalFileCacheService} from '../services/local-file-cache.service';
import {from} from 'rxjs';
import {concatAll} from 'rxjs/operators';

export interface IButtonController {
  readonly color: string;
  readonly iconName: string;

  onClick: (e: MouseEvent) => void;
}

export type ButtonType = 'save' | 'delete' | 'run';

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
    protected localFileCache: LocalFileCacheService
  ) {
  }

  readonly color = '#f44336';
  readonly iconName = 'delete';

  onClick(e: MouseEvent): void {
    this.localFileCache.deleteSelected().subscribe();
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

@Injectable({
  providedIn: 'root'
})
export class ButtonControllerFactory {
  constructor(
    private saveController: SaveButtonController,
    private deleteController: DeleteButtonController,
    private runController: RunButtonController,
  ) {
  }

  getController(type: ButtonType): IButtonController {
    if (type === 'save') {
      return this.saveController;
    } else if (type === 'delete') {
      return this.deleteController;
    } else if (type === 'run') {
      return this.runController;
    }
  }
}
