import {Component, OnInit, OnChanges} from '@angular/core';

@Component({
    selector: 'app-sms',
    templateUrl: './sms.component.html',
    styleUrls: ['./sms.component.less']
})
export class SmsComponent implements OnInit {

    productId: any = 1;             // 产品ID
    parmas: any;                    // 查询要传递的参数
    segmentId: any;
    campaignId: any;
    reportObj: any = {};

    constructor() {
    }

    ngOnInit() {
        this.reportObj = {
            campaignId: 1619,
            segmentId: 2102,
            name: '假的数据',
            right: true
        };
    }

}
