import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripper'
})
export class StripperPipe implements PipeTransform {
  badWords = ['debit', 'credit', 'ach', 'card', 'purchase', 'recurring', 'payment', 'web-single', 'websingle', 'online'];
  transform(value: any, args?: any): any {
    let newVal = value;
    for (const index in this.badWords) {
      if (new RegExp(this.badWords.join('|'), 'ig').test(newVal.toLowerCase())) {
        const searchMask = this.badWords[index];
        const regEx = new RegExp(searchMask, 'ig');

        newVal = newVal.replace(regEx, '');
      } else {
        break;
      }
      console.log(newVal);
    }
    newVal = newVal.replaceAll(/[a-z]*\d+[a-z]*/gi, '');
    return newVal;
  }

}
declare var String;
String.prototype.replaceAll = function (search, replacement) {
  const target = this;
  return target.split(search).join(replacement);
};
