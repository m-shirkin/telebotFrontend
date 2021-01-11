import {Component, OnInit} from '@angular/core';
import {FileApiService} from '../services/file-api.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {LocalFileCacheService} from '../services/local-file-cache.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {

  fileList: Array<string>;
  runningFile = 'test1.ts';

  constructor(
    private fileApi: FileApiService,
    private localFileCache: LocalFileCacheService,
  ) {
  }

  ngOnInit(): void {
    this.localFileCache.init().subscribe(
      (): void => {
        this.fileList = this.localFileCache.getFileList();
      });
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
