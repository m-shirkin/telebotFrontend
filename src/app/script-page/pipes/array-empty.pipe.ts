import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayEmpty'
})
export class ArrayEmptyPipe implements PipeTransform {

  transform<T>(value: Array<T>): boolean {
    console.log(value);
    return !value || (value.length === 0);
  }

}
