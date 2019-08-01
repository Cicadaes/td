import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '../../common/base-component';
import { FunnelTableService } from './funnel-table/funnel-table.service';

@Component({
  selector: 'app-trans-funnel',
  templateUrl: './trans-funnel.component.html',
  styleUrls: ['./trans-funnel.component.less']
})
export class TransFunnelComponent extends BaseComponent implements OnInit, OnChanges {
  tabList1: any = [
    {
      name: 'App转化漏斗',
      filter: 'App'
    },
    {
      name: 'H5转化漏斗',
      filter: 'H5'
    },
    {
      name: '小程序转化漏斗',
      filter: 'miniprogram'
    },
    {
      name: 'Web转化漏斗',
      filter: 'Web'
    }
  ];

  urlParams: any;
  locationHash: string;
  tabList: any = [];
  pagePathFilter: any;
  selectedIndex: number = 0;
  isVisitor: boolean = false;

  constructor(private service: FunnelTableService, private injector: Injector) {
    super(injector);
    this.initRouterList('转化漏斗');

    this.urlParams = {};
  }

  ngOnInit() {
    this.locationHash = location.hash;
    this.isVisitor = JSON.parse(localStorage.getItem('IsVisitor'));
    if (this.isVisitor) {
      let ids = [];
      this.service.getTabList(this.productId).subscribe((response: any) => {
        if (response) {
          if (response.list) {
            for (let i = 0; i < response.list.length; i++) {
              ids.push(response.list[i].dicItemValue);
            }
            this.setTabList(ids);
          }
        } else {
          const productInfo = JSON.parse(localStorage.getItem('productInfo'));
          if (productInfo && productInfo.sourceids) {
            ids = productInfo.sourceids.split(',');
            this.setTabList(ids);
          }
        }
      });
    }
  }

  setTabList(ids: any) {
    let tabs = ['', '', '', ''];
    if (ids.indexOf('App') > -1) {
      tabs[0] = 'App';
    }
    if (ids.indexOf('H5') > -1) {
      tabs[1] = 'H5';
    }
    if (ids.indexOf('Web') > -1) {
      tabs[2] = 'Web';
    }
    if (ids.indexOf('miniprogram') > -1) {
      tabs[3] = 'miniprogram';
    }
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i] == 'App') {
        this.tabList.push(this.tabList1[0]);
      } else if (tabs[i] == 'H5') {
        this.tabList.push(this.tabList1[1]);
      } else if (tabs[i] == 'Web') {
        this.tabList.push(this.tabList1[3]);
      } else if (tabs[i] == 'miniprogram') {
        this.tabList.push(this.tabList1[2]);
      }
    }
    this.pagePathFilter = this.globals.getStorageLocal('trans_funnel_tab')
      ? this.globals.getStorageLocal('trans_funnel_tab')
      : this.tabList.length > 0
      ? this.tabList[0].filter
      : '';
    for (let j = 0; j < this.tabList.length; j++) {
      if (this.pagePathFilter == this.tabList[j].filter) {
        this.selectedIndex = j;
      }
    }
  }

  setTab(value: any, index: any) {
    this.globals.setStorageLocal('trans_funnel_tab', value);
    this.pagePathFilter = value;
  }
  changeItem(item) {
    this.pagePathFilter = item;
  }
}
