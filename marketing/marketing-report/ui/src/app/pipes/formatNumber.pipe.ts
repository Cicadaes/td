import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'formatNumber'})
export class FormatNumberPipe implements PipeTransform {
    transform(number: any): string{
        number = number + '';
        return this.formatNumber(number);
    }

    formatNumber(number: string) {
        if (!/^[0-9]*$/.test(number)) {
            return number;
        }
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