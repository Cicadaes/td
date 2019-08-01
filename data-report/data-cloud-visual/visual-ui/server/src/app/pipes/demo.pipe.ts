/**
 * Created by wangshouyun on 2016/12/31.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'myDemo'})
export class DemoPipe implements PipeTransform {
    transform(value: number, exponent: string): number {
        let exp = parseFloat(exponent);
        return Math.pow(value, isNaN(exp) ? 1 : exp);
    }
}
