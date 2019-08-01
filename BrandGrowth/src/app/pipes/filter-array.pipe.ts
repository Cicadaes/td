import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'farray'
})
export class FilterArrayPipe implements PipeTransform {

  transform(list: any, fields: any, option: any): any {
    let alist: any;
    Observable
    .from(list)
    .filter((result: any) => {
      let flag = false;

      fields.map((field: any) => {
        if(result && result[field] && new RegExp(option, 'gi').test(result[field])) {
          flag = true;
        }
      })

      return flag;
    })
    .startWith([])
    .reduce((pre: any, cur: any) => {
      pre.push(cur);
      return pre;
    })
    .subscribe((list) => {
      alist = list;
    })
    return alist;
  }

}