import {Component, OnInit} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {LocalFileCacheService} from '../services/local-file-cache.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  fileListObservable: Observable<Array<string>>;

  runningFileObservable: Observable<string>;

  constructor(
    private localFileCache: LocalFileCacheService,
  ) {
    this.fileListObservable = this.localFileCache.getFileListChanged();
    this.fileListObservable.subscribe(
      (fileList: Array<string>) => {
        this.onFileListChange(fileList);
      }
    );
    this.runningFileObservable = this.localFileCache.getRunningFileChanged();
  }

  ngOnInit(): void {
  }

  onFileListChange(fileList: Array<string>): void {
  }

  tabChanged(event: MatTabChangeEvent): void {
    this.localFileCache.setSelectedFile(event.tab.textLabel);
  }

  generateModifiedCheck(): (f: string) => boolean {
    const cache = this.localFileCache;
    return (f: string) => {
      return cache.isModified(f);
    };
  }
}
