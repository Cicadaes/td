import { Component, Injector, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import * as differenceInDays from 'date-fns/difference_in_days';
import { PageHeatmapService } from './page-heatmap.service';
import { PageHeatmapH5Component } from './page-heatmap-h5/page-heatmap-h5.component';
import { BaseComponent } from '../../common/base-component';

@Component({
  selector: 'app-page-heatmap',
  templateUrl: './page-heatmap.component.html',
  styleUrls: ['./page-heatmap.component.less']
})
export class PageHeatmapComponent extends BaseComponent implements OnInit, OnDestroy {
  tabList: any = [
    {
      url: '/page-analysis/page-heatmap/page-heatmap-h5',
      name: 'H5页面'
    },
    {
      url: '/page-analysis/page-heatmap/page-heatmap-web',
      name: 'Web页面'
    }
  ];

  @ViewChild(PageHeatmapH5Component)
  _dateFormat = 'yyyy-MM-dd';
  _today = new Date();
  _dateRange;
  _dateRangeOld;
  backDateRange: any[];
  urlParams: any;
  locationHash: string;

  constructor(private service: PageHeatmapService, private injector: Injector) {
    super(injector);
    this.initRouterList('页面热力图');

    this.urlParams = {};
    this.listenerRouterChange();
  }

  _disabledDate = (current: Date): boolean => {
    return differenceInDays(current, this._today) > 0; // || differenceInDays(current, this._today) < -365;
  };

  _initDateRange() {
    this.locationHash = location.hash;
    if (!this._dateRange) {
      const date = this.globals.getDateRangeByLastDay(-6);
      this._dateRange = [new Date(date.start), new Date(date.end)];
    }
    this.onBackDateRange();
  }

  onBackDateRange() {
    if (this._dateRange && this._dateRange.length === 2) {
      this.backDateRange = [this._dateRange[0].getTime(), this._dateRange[1].getTime()];
      this.service.confirmMission(this.backDateRange);
      this._dateRangeOld = this._dateRange;
    }
  }

  _changeDaterange(value: any) {
    const days = this.globals.getDateDays(this._dateRange[0], this._dateRange[1]);
    console.dir(days);
    if (days > 365) {
      setTimeout(() => {
        this._dateRange = this._dateRangeOld;
      }, 100);
      this.message.create('warning', '时间范围不能超过一年');
      return false;
    }
    this._dateRange = value;
    this.onBackDateRange();
  }

  listenerRouterChange() {
    this.router.events.subscribe(event => {
      //        // console.log(event);   // 包括NavigationStart, RoutesRecognized, NavigationEnd
      if (event instanceof NavigationEnd) {
        // 当导航成功结束时执行
        setTimeout(() => this._initDateRange(), 500);
      }
    });
  }

  ngOnInit() {
    this.locationHash = location.hash;
  }

  ngOnDestroy() {}
}
