import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {FileApiService} from './file-api.service';
import {map} from 'rxjs/operators';

interface ICache {
  contents: string;
  modified: boolean;
  loaded: boolean;
}

const NOT_LOADED: ICache = {
  contents: '',
  modified: false,
  loaded: false
};

interface IFileCachedData {
  [index: string]: ICache;
}

@Injectable({
  providedIn: 'root'
})
export class LocalFileCacheService {
  private currentTabContents: Subject<void>;

  private selectedFile: string;

  private fileCachedData: IFileCachedData;

  constructor(
    private fileApi: FileApiService
  ) {
    this.currentTabContents = new Subject<void>();
  }

  init(): Observable<void> {
    this.fileCachedData = {};
    return this.fileApi.getFileList().pipe(map((fList: Array<string>) => {
      for (const fName of fList) {
        this.fileCachedData[fName] = NOT_LOADED;
      }
    }));
  }

  getFileList(): Array<string> {
    return Object.keys(this.fileCachedData);
  }

  GetTabChangedObservable(): Observable<void> {
    return this.currentTabContents;
  }

  setSelectedFile(filename: string): void {
    this.selectedFile = filename;
    if (!this.fileCachedData[filename].loaded) {
      this.fileApi.loadFile(filename).subscribe((newContents: string): void => {
        this.fileCachedData[filename] = {
          contents: newContents,
          loaded: true,
          modified: false,
        };
        this.currentTabContents.next();
      });
    } else {
      this.currentTabContents.next();
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
}
