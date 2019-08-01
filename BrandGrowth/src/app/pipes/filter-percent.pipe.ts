import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'fpercent'
})
export class FilterPercentPipe implements PipeTransform {
  constructor(private percentPipe: PercentPipe) {}

  transform(value: any): any {
    if (value === Infinity || value === -Infinity || isNaN(value)) {
    // if((value || value === 0) && (value < Infinity && value > -Infinity)) {
      return 'N/A';
    } else {
      return this.percentPipe.transform(value, '0.2-2');
    }
  }
}