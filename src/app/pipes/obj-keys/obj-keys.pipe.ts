import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objKeys'
})
export class ObjKeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      keys.push(key);
    }
    return keys;
  }
}
