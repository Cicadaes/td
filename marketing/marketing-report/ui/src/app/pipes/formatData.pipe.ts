import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatData'})
export class FormatDataPipe implements PipeTransform {
    transform(data: any): string {
        if(!data && data != 0) {
            return '--';
        } else {
            return this.formatNumber(data + '');
        }
    }

    formatNumber(number: string) {
        let length = Math.floor(number.length / 3);
        let tempNumber = number.split('');
        for (let i = 0; i < length; i++) {
            tempNumber.splice(-(((i + 1) * 3) + i), 0, ',');
        }
        if (tempNumber[0] == ',') {
            tempNumber.shift();
        }
        return tempNumber.join('');
    }
}