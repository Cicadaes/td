import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'formatPromotionData'})
export class FormatPromotionDataPipe implements PipeTransform {

    transform(data: any): string {
        let that = this;
        if (data.triggerType == '1' || data.triggerType == '2') {
            return that.defaultFormat(data.appointedTime || data.sendTime);
        } else if (data.triggerType == '3') {
            if (data.subTriggerType == '4') {
                return that.weekFormat(data.cycleVal, data.cycleHour, data.cycleMinute);
            } else if (data.subTriggerType == '5') {
                return that.monthFormat(data.cycleVal, data.cycleHour, data.cycleMinute);
            } else {
                return that.dayFormat(data.cycleHour, data.cycleMinute);
            }
        } else if (data.triggerType == '4') {
            return that.weekFormat(data.cycleVal, data.cycleHour, data.cycleMinute);
        } else if (data.triggerType == '5') {
            return that.monthFormat(data.cycleVal, data.cycleHour, data.cycleMinute);
        }
    }

    defaultFormat(time: any) {
        if (time) {
            return moment(time).format('YYYY-MM-DD HH:mm');
        }
    }

    dayFormat(hour: number, minute: number) {
        if ((hour || hour == 0)&& (minute || minute == 0)) {
            let tempHour: string;
            let tempMinute: string;
            if (hour < 10) {
                tempHour = '0' + hour;
            } else {
                tempHour = '' + hour;
            }
            if (minute < 10) {
                tempMinute = '0' + minute;
            } else {
                tempMinute = '' + minute;
            }
            return '每天 ' + tempHour + ': ' + tempMinute;
        }
    }

    private weekList = {
        1: '星期一',
        2: '星期二',
        3: '星期三',
        4: '星期四',
        5: '星期五',
        6: '星期六',
        7: '星期日'
    }

    weekFormat(val: number, hour: number, minute: number){
        if (val && (hour || hour == 0)&& (minute || minute == 0)) {
            let tempHour: string;
            let tempMinute: string;
            if (hour < 10) {
                tempHour = '0' + hour;
            } else {
                tempHour = '' + hour;
            }
            if (minute < 10) {
                tempMinute = '0' + minute;
            } else {
                tempMinute = '' + minute;
            }
            return '每周 ' + this.weekList[val] + ' ' + tempHour + ': ' + tempMinute;
        }
    }

    monthFormat(val: number, hour: number, minute: number) {
        if (val && (hour || hour == 0)&& (minute || minute == 0)) {
            let tempHour: string;
            let tempMinute: string;
            if (hour < 10) {
                tempHour = '0' + hour;
            } else {
                tempHour = '' + hour;
            }
            if (minute < 10) {
                tempMinute = '0' + minute;
            } else {
                tempMinute = '' + minute;
            }
            return '每月 ' + val + '号 ' + tempHour + ': ' + tempMinute;
        }
    }
}