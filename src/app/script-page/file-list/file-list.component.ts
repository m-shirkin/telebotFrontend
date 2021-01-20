import {Component, ViewChild} from '@angular/core';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {LocalFileCacheService} from '../services/local-file-cache.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent {
  runningFilename: string;

  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

  constructor(
    public localFileCache: LocalFileCacheService,
  ) {
    this.localFileCache.getFileListChanged().subscribe(
      (fileList: Array<string>) => {
        this.onFileListChange(fileList);
      }
    );
    this.localFileCache.getRunningFileChanged().subscribe(
      (fname: string): void => {
        this.runningFilename = fname;
      }
    );
  }

  onFileListChange(fileList: Array<string>): void {
    if (this.matTabGroup.selectedIndex === 0) {
      this.localFileCache.setSelectedFile(
        fileList[0]
      );
    }
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
