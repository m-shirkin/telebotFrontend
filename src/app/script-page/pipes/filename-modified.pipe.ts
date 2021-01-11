import {Pipe, PipeTransform} from '@angular/core';
import {LocalFileCacheService} from '../services/local-file-cache.service';

@Pipe({
  name: 'filenameModified',
  pure: false,
})
export class FilenameModifiedPipe implements PipeTransform {
  constructor(
    private localFileCache: LocalFileCacheService
  ) {
  }

  transform(value: string): string {
    if (this.localFileCache.isModified(value)) {
      return value + '*';
    } else {
      return value;
    }
  }

}
