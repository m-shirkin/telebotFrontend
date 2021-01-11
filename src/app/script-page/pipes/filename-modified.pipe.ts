import {Pipe, PipeTransform} from '@angular/core';
import {LocalFileCacheService} from '../services/local-file-cache.service';

@Pipe({
  name: 'filenameModified',
})
export class FilenameModifiedPipe implements PipeTransform {
  transform(value: string, modifiedCheck: (f: string) => boolean): string {
    if (modifiedCheck(value)) {
      return value + '*';
    } else {
      return value;
    }
  }

}
