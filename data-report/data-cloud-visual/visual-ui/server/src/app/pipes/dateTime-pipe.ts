import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dataTime'})
export class DataTimePipe implements PipeTransform {
    transform(start: any, end:any): string {
        return this.dataTime(start,end);
    }

    dataTime(starttime: any,endtime: any): any {
        let startTime = starttime;
        let endTime = endtime;
        let hsTime = endTime - startTime;

        //计算出相差天数
        let days = Math.floor(hsTime/(24*3600*1000));
        //计算出小时数
        let leave1=hsTime%(24*3600*1000);  //计算天数后剩余的毫秒数
        let hours=Math.floor(leave1/(3600*1000));

        //计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));

        //计算相差秒数
        var leave3=leave2%(60*1000);     //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000);

        return `${days}天${hours}小时${minutes}分${seconds}秒`

    }
}