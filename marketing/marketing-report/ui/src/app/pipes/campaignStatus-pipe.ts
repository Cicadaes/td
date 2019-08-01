import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'campaignStatus'})
export class CampaignStatusPipe implements PipeTransform {
    transform(value: any): string {
        if (value == 1) {
            return '未开始';
        } else if (value == 2) {
            return '进行中';
        } else if (value == 3) {
            return '已完成';
        }
    }
}