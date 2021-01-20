import {Injectable} from '@angular/core';
import {from, Observable, Subject} from 'rxjs';
import {FileApiService} from './file-api.service';
import {concatAll, filter, last, map, mergeMap, takeLast} from 'rxjs/operators';

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

interface IFileCachedData {
  [index: string]: ICache;
}

@Injectable({
  providedIn: 'root'
})
export class LocalFileCacheService {
  private currentTabChanged: Subject<string>;

  private fileListChanged: Subject<Array<string>>;

  private runningFileChanged: Subject<string>;

  private selectedFile: string;

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

  private getFileList(): Array<string> {
    return Object.keys(this.fileCachedData);
  }

  private updateFileList(): void {
    this.fileListChanged.next(this.getFileList());
  }

  getFileListChanged(): Observable<Array<string>> {
    return this.fileListChanged;
  }

  getTabChanged(): Observable<string> {
    return this.currentTabChanged;
  }

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

  getSelectedFile(): string {
    return this.selectedFile;
  }

  isModified(filename: string): boolean {
    return this.fileCachedData[filename] && this.fileCachedData[filename].modified;
  }

  getCurrentContents(): string {
    return this.fileCachedData[this.getSelectedFile()].contents;
  }

  updateContents(newContents: string): void {
    if (this.getCurrentContents() !== newContents) {
      this.fileCachedData[this.selectedFile] = {
        contents: newContents,
        modified: true,
        loaded: true,
      };
    }
  }

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

  deleteSelected(): Observable<void> {
    return this.deleteFile(this.getSelectedFile());
  }

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

  private renameFile(filename: string, newFilename: string): Observable<void> {
    const fileContents = this.fileCachedData[filename].contents;
    return from([this.deleteFile(filename), this.createFile(newFilename)])
      .pipe(
        concatAll(),
        last(),
        map(
          () => {
            this.fileCachedData[newFilename] = {
              contents: fileContents,
              loaded: true,
              modified: false,
            };
            this.updateFileList();
          }
        )
      );
  }

  renameSelected(newFilename: string): Observable<void> {
    return this.renameFile(this.getSelectedFile(), newFilename);
  }

  getRunningFileChanged(): Observable<string> {
    return this.runningFileChanged;
  }

  private runFile(filename: string): Observable<void> {
    return this.fileApi.runFile(filename).pipe(
      map(
        (): void => {
          this.runningFileChanged.next(filename);
        }
      )
    );
  }

  runSelectedFile(): Observable<void> {
    return this.runFile(this.selectedFile);
  }
}
