import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'fnumber'
})
export class FilterNumberPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: any): any {
    if (value === Infinity || value === -Infinity || isNaN(value)) {
    // if((value || value === 0) && (value < Infinity && value > -Infinity) ) {
      return 'N/A';
    } else {
      // return this.decimalPipe.transform(value);
      return value.toFixed(2);
    }
  }
}