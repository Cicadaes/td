import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.less']
})
export class PushComponent implements OnInit {
  productId: any = 1; // 产品ID
  reportObj: any = {};

  constructor() {}

  ngOnInit() {
    this.reportObj = {
      campaignId: 1619,
      segmentId: 2102,
      name: '假的数据',
      right: true
    };
  }
}
