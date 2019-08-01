import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatTime'})
export class FormatTimePipe implements PipeTransform {
    transform(data: string): string {
        let time = new Date(data);
        var year = time.getFullYear();
        var month = time.getMonth()+1;
        var day = time.getDate();
        return `${year}-${month}-${day}`;
    }

}