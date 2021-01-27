import { Pipe, PipeTransform } from '@angular/core';

/**
 * Output whether array exists and is not empty
 */
@Pipe({
  name: 'arrayEmpty'
})
export class ArrayEmptyPipe implements PipeTransform {

  transform<T>(value: Array<T>): boolean {
    return !value || (value.length === 0);
  }

}
