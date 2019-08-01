import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'numberToThousandsPipe'})
export class NumberToThousandsPipe implements PipeTransform {
    transform(value: any, type: number): string {
        if (type && type === 2) {
            return this.toThousands2(value);
        } else {
            return this.toThousands(value);
        }
    }

    toThousands(value: any) {
        let num = (value || 0).toString(), result = '';
        let isDecimal = false;
        let numAttr;
        if (num.indexOf('.') !== -1) {
            isDecimal = true;
            numAttr = num.split('.');
            num = numAttr[0];
        }
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) {
            result = num + result;
        }
        if (isDecimal && numAttr.length > 1) {
            result = result + '.' + numAttr[1];
        }
        return result;
    }

    toThousands2(value: any) {
        let result = '';
        result = value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        return result;
    }
}

@NgModule({
    imports: [],
    exports: [NumberToThousandsPipe],
    declarations: [NumberToThousandsPipe]
})
export class NumberToThousandsPipeModule {
}
