import {
  Component, 
  OnInit,
  OnDestroy,
} from '@angular/core';

import { ApiCommonComponent } from '../api-common.component';

@Component({
  selector: 'device-details-container',
  templateUrl: './device-details-container.component.html',
  styleUrls: ['./device-details-container.component.less']
})
export class DeviceDetailsContainerComponent implements ApiCommonComponent, OnInit, OnDestroy {

  private pieConfig: any = null;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  // 初始化组件
  resetMove() {
    console.log('reset --- ');
  }

  // 清空当前页面数据
  clearData() {

  }
}
