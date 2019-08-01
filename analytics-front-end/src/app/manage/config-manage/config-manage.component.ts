import { Component, OnInit } from '@angular/core';
import { ConfigManageService } from './config-manage.service';

@Component({
  selector: 'app-config-manage',
  templateUrl: './config-manage.component.html',
  styleUrls: ['./config-manage.component.less']
})
export class ConfigManageComponent implements OnInit {
  appSourceId: string; // 标明产品类型

  constructor(private service: ConfigManageService) {}

  ngOnInit() {
    this.appSourceId = 'App'; // 此处模拟获取产品类型
  }
}
