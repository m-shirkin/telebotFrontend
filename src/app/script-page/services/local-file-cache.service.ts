import {Injectable} from '@angular/core';
import {from, Observable, Subject, Subscriber} from 'rxjs';
import {FileApiService} from './file-api.service';
import {concatAll, filter, last, map, mergeMap, takeLast} from 'rxjs/operators';

/**
 * Interface for storing information about a cached file
 *
 * contents: file contents.
 * modified: whether file was modified or not. If true, file was modified and its contents are different from actual contents on the server.
 * loaded: whether file was loaded from the server.
 */
interface ICache {
  contents: string;
  modified: boolean;
  loaded: boolean;
}

const NOT_LOADED: ICache = {
  contents: '',
  modified: false,
  loaded: false,
};

const NEW_FILE: ICache = {
  contents: '',
  modified: false,
  loaded: true,
};

/**
 * Interface for storing cached file data.
 */
interface IFileCachedData {
  [filename: string]: ICache;
}

/**
 * Service for storing cached file data locally.
 * Each file is loaded only once and only modified files are saved on server.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalFileCacheService {
  /**
   * Observable with current file tab opened.
   * @private
   */
  private currentTabChanged: Subject<string>;

  /**
   * Observable with current file list.
   * @private
   */
  private fileListChanged: Subject<Array<string>>;

  /**
   * Observable with current running file.
   * @private
   */
  private runningFileChanged: Subject<string>;

  /**
   * Current file tab opened.
   * @private
   */
  private selectedFile: string;

  /**
   * Data with all files and their cached contents.
   * @private
   */
  private fileCachedData: IFileCachedData;

  constructor(
    private fileApi: FileApiService
  ) {
    this.currentTabChanged = new Subject<string>();
    this.fileListChanged = new Subject<Array<string>>();
    this.runningFileChanged = new Subject<string>();
    this.init().subscribe(() => {
    });
  }

  /**
   * On init pull file list and running file name from the server.
   * @private
   */
  private init(): Observable<void> {
    this.fileCachedData = {};
    const fileListInit = this.fileApi.getFileList().pipe(
      map(
        (fList: Array<string>) => {
          for (const fName of fList) {
            this.fileCachedData[fName] = NOT_LOADED;
          }
          this.fileListChanged.next(fList);
        }
      )
    );
    const runningFileInit = this.fileApi.getRunningFile().pipe(
      map(
        (runningFile: string) => {
          this.runningFileChanged.next(runningFile);
        }
      )
    );
    return from([fileListInit, runningFileInit]).pipe(
      mergeMap(
        (query: Observable<void>): Observable<void> => {
          return query;
        }
      ),
      last(),
    );
  }

  /**
   * Get cached file list.
   * @private
   */
  private getFileList(): Array<string> {
    return Object.keys(this.fileCachedData);
  }

  /**
   * Push current file list into the observable fileListChanged.
   * @private
   */
  private updateFileList(): void {
    this.fileListChanged.next(this.getFileList());
  }

  /**
   * Get reference to fileListChanged observable.
   */
  getFileListChanged(): Observable<Array<string>> {
    return this.fileListChanged;
  }

  /**
   * Get reference to currentTabChanged observable.
   */
  getTabChanged(): Observable<string> {
    return this.currentTabChanged;
  }

  /**
   * Set new file as selected, pulling its contents from the server if necessary.
   * @param filename: new selected file
   */
  setSelectedFile(filename: string): void {
    this.selectedFile = filename;
    if (!this.fileCachedData[filename].loaded) {
      this.fileApi.loadFile(filename).subscribe(
        (newContents: string): void => {
          this.fileCachedData[filename] = {
            contents: newContents,
            loaded: true,
            modified: false,
          };
          this.currentTabChanged.next(filename);
        }
      );
    } else {
      this.currentTabChanged.next(filename);
    }
  }

  /**
   * Get selected file name
   */
  getSelectedFile(): string {
    return this.selectedFile;
  }

  /**
   * Get true or false based on whether a file was modified or not.
   * @param filename
   */
  isModified(filename: string): boolean {
    return this.fileCachedData[filename] && this.fileCachedData[filename].modified;
  }

  /**
   * Get contents of a currently selected file.
   */
  getCurrentContents(): string {
    return this.fileCachedData[this.getSelectedFile()].contents;
  }

  /**
   * Update cached contents of a selected file.
   * @param newContents
   */
  updateContents(newContents: string): void {
    if (this.getCurrentContents() !== newContents) {
      this.fileCachedData[this.selectedFile] = {
        contents: newContents,
        modified: true,
        loaded: true,
      };
    }
  }

  /**
   * Push all modified files to server.
   */
  pushToServer(): Observable<void> {
    return from(this.getFileList())
      .pipe(
        filter(
          (filename: string): boolean => {
            return this.isModified(filename);
          }
        ),
        mergeMap((filename: string): Observable<void> => {
          return this.fileApi.pushFile(
            filename,
            this.fileCachedData[filename].contents
          ).pipe(
            map(() => {
              this.fileCachedData[filename].modified = false;
            })
          );
        }),
        takeLast(1),
      );
  }

  /**
   * Delete a specific file on server, then from cache.
   * @param filename
   * @private
   */
  private deleteFile(filename: string): Observable<void> {
    return this.fileApi.deleteFile(filename)
      .pipe(
        map(
          () => {
            delete this.fileCachedData[filename];
            this.updateFileList();
          }
        )
      );
  }

  /**
   * Delete the selected file on server, then from cache.
   */
  deleteSelected(): Observable<void> {
    return this.deleteFile(this.getSelectedFile());
  }

  /**
   * Create a file with empty contents on server, then in cache.
   * @param filename
   */
  createFile(filename: string): Observable<void> {
    return this.fileApi.pushFile(filename, '').pipe(
      map(
        (): void => {
          this.fileCachedData[filename] = NEW_FILE;
          this.updateFileList();
        }
      )
    );
  }

  /**
   * Rename a file by creating a new file with different name and same contents and deleting old file.
   * @param filename
   * @param newFilename
   * @private
   */
  private renameFile(filename: string, newFilename: string): Observable<void> {
    const fileContents = this.fileCachedData[filename].contents;
    return from([
      this.fileApi.pushFile(newFilename, fileContents),
      new Observable<void>((observer: Subscriber<void>) => {
        this.fileCachedData[newFilename] = {
          contents: fileContents,
          loaded: true,
          modified: false,
        };
        observer.next();
        observer.complete();
      }),
      this.deleteFile(filename),
    ])
      .pipe(
        concatAll(),
        last(),
        map(
          () => {
            this.updateFileList();
          }
        )
      );
  }

  /**
   * Rename selected file by creating a new file with different name and same contents and deleting old file.
   * @param newFilename
   */
  renameSelected(newFilename: string): Observable<void> {
    return this.renameFile(this.getSelectedFile(), newFilename);
  }

  /**
   * Get a reference to an observable with running file mane.
   */
  getRunningFileChanged(): Observable<string> {
    return this.runningFileChanged;
  }

  /**
   * Run a specific file.
   * @param filename
   * @private
   */
  private runFile(filename: string): Observable<void> {
    return this.fileApi.runFile(filename).pipe(
      map(
        (): void => {
          this.runningFileChanged.next(filename);
        }
      )
    );
  }

  /**
   * Run selected file.
   */
  runSelectedFile(): Observable<void> {
    return this.runFile(this.selectedFile);
  }
}
