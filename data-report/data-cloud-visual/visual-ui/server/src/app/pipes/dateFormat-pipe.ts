import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dataFormat'})
export class DataFormatPipe implements PipeTransform {
    transform(value: number): string {
        return this.dateFormat(value);
    }

    dateFormat(time: any): any {
        let year, month, day,hours,minutes,seconds;
        if (time) {
            year = new Date(time).getFullYear()
            year = year < 10 ? "0" + year : year
            month = new Date(time).getMonth() + 1
            month = month < 10 ? "0" + month : month
            day = new Date(time).getDate()
            day = day < 10 ? "0" + day : day
            hours=new Date(time).getHours()
            hours = hours < 10 ? "0" + hours : hours
            minutes=new Date(time).getMinutes()
            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds=new Date(time).getSeconds()
            seconds = seconds < 10 ? "0" + seconds : seconds
            return  `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }
    }
}