import {Component, NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dateFormatPipe'})
export class DateFormatPipe implements PipeTransform {
    transform(value: any, type: number): string {
        if (type && type === 1) {
            return this.dateFormat1(value);
        } else if (type && type === 2) {
            return this.dateFormat2(value);
        } else {
            return this.dateFormat(value);
        }
    }

    dateFormat(time: any): any {
        let year, month, day, hours, minutes, seconds;
        if (time) {
            year = new Date(time).getFullYear();
            year = year < 10 ? '0' + year : year;
            month = new Date(time).getMonth() + 1;
            month = month < 10 ? '0' + month : month;
            day = new Date(time).getDate();
            day = day < 10 ? '0' + day : day;
            hours = new Date(time).getHours();
            hours = hours < 10 ? '0' + hours : hours;
            minutes = new Date(time).getMinutes();
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = new Date(time).getSeconds();
            seconds = seconds < 10 ? '0' + seconds : seconds;
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }

    dateFormat1(time: any): any {
        let year, month, day;
        if (time) {
            time = time.toString();
            year = time.substring(0, 4);
            month = time.substring(4, 6);
            day = time.substring(6, 8);
            return `${year}-${month}-${day}`;
        }
    }

    dateFormat2(time: any): any {
        let year, month, day;
        if (time) {
            time = time.toString();
            if (time.indexOf('~') !== -1) {
                year = time.substring(0, 4);
                month = time.substring(4, 6);
                day = time.substring(6, 8);
                const year2 = time.substring(9, 13);
                const month2 = time.substring(13, 15);
                const day2 = time.substring(15, 17);
                return `${year}-${month}-${day}~${year2}-${month2}-${day2}`;
            } else {
                year = time.substring(0, 4);
                month = time.substring(4, 6);
                day = time.substring(6, 8);
                return `${year}-${month}-${day}`;
            }
        }
    }
}

@NgModule({
    imports: [],
    exports: [DateFormatPipe],
    declarations: [DateFormatPipe]
})
export class DateFormatPipeModule {
}
