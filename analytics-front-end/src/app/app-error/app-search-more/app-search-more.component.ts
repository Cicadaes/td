import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { AppErrorService } from '../app-error.service';
import { BaseComponent } from 'src/app/common/base-component';
@Component({
  selector: 'app-search-more',
  templateUrl: './app-search-more.component.html',
  styleUrls: ['./app-search-more.component.less']
})
export class AppSearchMoreComponent extends BaseComponent implements OnInit {
  @Output() searchMore = new EventEmitter<any>();
  @Input() productId: any;
  parmas = {};
  selectedBrand = 1;
  brandList = [];
  selectedSystem = 1;
  systemList = [];
  selectedApp = 1;
  appList = [];
  selectedChannel = 1;
  channelList = [];
  constructor(private appErrorService: AppErrorService, private injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.parmas = {
      productId: this.productId,
      key: '_td_os',
      page: 1,
      limit: 20000
    };
    this.processData('_td_mobile');
    this.processData('_td_os');
    this.processData('_td_current_appversion');
    this.processData('_td_channel');
  }

  // 获取操作系统查询列表
  processData(key: any) {
    this.parmas['key'] = key;
    this.appErrorService.getDic(this.parmas).subscribe((response: any) => {
      const obj = {
        key: 1,
        value: '全部'
      };
      if (key === '_td_mobile') {
        this.brandList = response.list;
        this.brandList.unshift(obj);
      } else if (key === '_td_os') {
        this.systemList = response.list;
        this.systemList.unshift(obj);
      } else if (key === '_td_current_appversion') {
        this.appList = response.list;
        this.appList.unshift(obj);
      } else if (key === '_td_channel') {
        this.channelList = response.list;
        this.channelList.unshift(obj);
      }
    });
  }

  search() {
    const obj = {};
    obj['_td_mobile'] = this.selectedBrand;
    obj['_td_os'] = this.selectedSystem;
    obj['_td_current_appversion'] = this.selectedApp;
    obj['_td_channel'] = this.selectedChannel;
    this.searchMore.emit(obj);
  }
}
