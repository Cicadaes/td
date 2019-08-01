import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'toDateStr'
})
export class ToDateStrPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const dateLong = value.getTime() + 8 * 3600 * 1000;
        return (new Date(dateLong)).toISOString().substr(0, 10);
    }

}
