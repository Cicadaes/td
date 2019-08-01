import { Component, Injector, ViewChild, OnInit, OnChanges } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import * as differenceInDays from 'date-fns/difference_in_days';
import { PagePathService } from './../page-path.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-page-path-date-filter',
  templateUrl: './page-path-date-filter.component.html',
  styleUrls: ['./page-path-date-filter.component.less']
})
export class PagePathDateFilterComponent extends BaseComponent implements OnInit, OnChanges {
  _dateFormat = 'yyyy-MM-dd';
  _today = new Date();
  _dateRange;
  _dateRangeOld;
  backDateRange: any[];
  urlParams: any;
  _isCollapse: any;
  _filter: any;
  _isInitFilter: boolean;
  _allFilter: any;
  _needSearch: boolean;
  locationHash: string;

  constructor(private service: PagePathService, private injector: Injector) {
    super(injector);

    this.urlParams = {};
    setTimeout(() => this._initDateRange(), 500);
  }

  getPagePathFilter(filter: any) {
    setTimeout(() => (this._needSearch = false), 500);
    this._filter = filter;
    this.onBackAllFilter();
  }

  toggleCollapse() {
    this._isCollapse = !this._isCollapse;
    if (!this._isCollapse) {
      this._needSearch = true;
    }
  }

  _disabledDate = (current: Date): boolean => {
    return differenceInDays(current, this._today) > 0; // || differenceInDays(current, this._today) < -365;
  };

  _initDateRange() {
    this.locationHash = location.hash;
    this._dateRange = null;
    this._isCollapse = false;
    this._isInitFilter = true;
    if (!this._dateRange) {
      const date = this.globals.getDateRangeByLastDay(-6);
      this._dateRange = [new Date(date.start), new Date(date.end)];
    }
    this.onBackAllFilter();
  }

  onBackAllFilter() {
    if (this._dateRange && this._dateRange.length === 2) {
      this.backDateRange = [this._dateRange[0].getTime(), this._dateRange[1].getTime()];
      if (this._isCollapse) {
        this._allFilter = this._filter || {};
      } else {
        this._allFilter = {};
      }
      this._allFilter.startDate = this.backDateRange[0];
      this._allFilter.endDate = this.backDateRange[1];
      this.service.confirmMission(this._allFilter);
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
    this._needSearch = true;
  }

  ngOnInit() {
    this.locationHash = location.hash;
  }
}
