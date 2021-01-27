import {Pipe, PipeTransform} from '@angular/core';

/**
 * Adds '*' if provided modifiedCheck returns true
 */
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
