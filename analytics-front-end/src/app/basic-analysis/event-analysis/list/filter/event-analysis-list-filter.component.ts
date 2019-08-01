import { Component, SimpleChanges, Injector, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { EventAnalysisService } from '../../event-analysis.service';
import { BaseComponent } from '../../../../common/base-component';
import * as differenceInDays from 'date-fns/difference_in_days';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-analysis-list-filter',
  templateUrl: './event-analysis-list-filter.component.html',
  styleUrls: ['./event-analysis-list-filter.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisListFilterComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() loading: any;
  @Output() onFilter = new EventEmitter<boolean>();
  @Input() isList: any;
  @Input() data: any;
  _dateRange;
  _dateRangeOld;
  _today = new Date();
  _backDateRange: any;
  _filter: any = {
    startDate: null,
    endDate: null,
    sdkSource: null,
    platform: null,
    sdk: '',
    sdkChange: true,
    dateChange: false,
    platformChange: false,
    eventTypeId: '',
    eventTypeStr: ''
  };
  _platformList: any;
  _sdkSourceList: any;
  _appSdkSource: any;
  _eventTypeList: any;
  _eventTypeListCopy: any = [];
  _data: any;
  constructor(private service: EventAnalysisService, private injector: Injector) {
    super(injector);
    this._initDateRange();
    this._querySdkSourceList();
  }

  _querySdkSourceList() {
    const tmpEventJson = {
      page: 1,
      rows: 30,
      dicKey: '_td_sdk_source',
      sort: 'dic_item_alias',
      order: 'asc',
      productId: this.productId
    };
    this.service.getEventList(tmpEventJson).subscribe((result: any) => {
      if (result.success) {
        this._sdkSourceList = result.list;
        this._appSdkSource = this._getAppSdkSource(this._sdkSourceList);
        this._initSdkFilter();
        this._queryPlatformList();
      }
    });
  }

  _getAppSdkSource(list: any) {
    let appSdkSource;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].dicItemValue === 'App') {
          appSdkSource = list[i];
          break;
        }
      }
    }
    return appSdkSource;
  }

  _queryPlatformList() {
    const tmpEventJson = {
      page: 1,
      rows: 30,
      dicKey: '_td_platform',
      sort: 'dic_item_alias',
      order: 'asc',
      productId: this.productId
    };
    this.service.getEventList(tmpEventJson).subscribe((result: any) => {
      if (result.success) {
        this._platformList = this._initEventList(result.list, '全部');
        this._initPlatformFilter();
      }
    });
  }

  _initPlatformFilter() {
    if (!this._filter.platform) {
      if (this._platformList && this._platformList.length > 0) {
        this._filter.platform = this._platformList[0].id;
      }
    }
  }

  _initSdkFilter() {
    if (!this._filter.sdkSource) {
      if (this._sdkSourceList && this._sdkSourceList.length > 0) {
        this._filter.sdkSource = this._sdkSourceList[0].id;
        this._filter.sdk = this._sdkSourceList[0].dicItemAlias;
        this._queryEventTypeList(this._filter.sdk);
      }
    }
  }

  _queryEventTypeList(sdk: any) {
    this._eventTypeList = this._initEventList(null, '全部事件');
    const tmpEventJson = {
      page: 1,
      rows: 30,
      dicKey: 'eventtype',
      order: 'asc'
    };
    this.service.getEventList(tmpEventJson).subscribe((result: any) => {
      if (result.success) {
        this._eventTypeListCopy = this._initEventList(result.list, '全部事件');
        this._eventTypeList = this._initEventList(result.list, '全部事件');
        this._filter.eventTypeId = this._eventTypeList[0].id;
        if (sdk != 'miniprogram') {
          this._eventTypeList = this._eventTypeList.filter((value: any) => value.dicItemAlias.indexOf('小程序') < 0);
        } else {
          this._eventTypeList = this._eventTypeList.filter((value: any) => value.dicItemAlias != '自定义事件');
        }
        this.onFilterBack();
      }
    });
  }

  _initEventList(list: any, allLabel: any) {
    const res = [
      {
        id: '',
        dicItemAlias: allLabel || '全部'
      }
    ];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].dicItemAlias.indexOf('访问页面') < 0) {
          res.push(list[i]);
        }
      }
    }
    return res;
  }

  _disabledDate = (current: Date): boolean => {
    return differenceInDays(this.globals.getDateZeroTime(current), this.globals.getDateZeroTime(this._today)) > 0;
  };

  _initDateRange() {
    if (!this._dateRange) {
      const date = this.globals.getDateRangeByLastDay(-6);
      this._dateRange = [new Date(date.start), new Date(date.end)];
    }
    this.onBackDateRange();
  }

  _changeDaterange(value: any) {
    const days = this.globals.getDateDays(this._dateRange[0], this._dateRange[1]);
    if (days > 365) {
      setTimeout(() => {
        this._dateRange = this._dateRangeOld;
      }, 100);
      this.message.create('warning', '时间范围不能超过一年');
      return false;
    }
    this._dateRange = value;
    this._filter.sdkChange = false;
    this._filter.dateChange = true;
    this._filter.platformChange = false;
    this.onBackDateRange();
    if (!this.isList) {
      this.onFilterBack();
    }
  }

  onBackDateRange() {
    if (this._dateRange && this._dateRange.length === 2) {
      const start = this.globals.dateFormat(this._dateRange[0].getTime(), 'day');
      const end = this.globals.dateFormat(this._dateRange[1].getTime(), 'day');
      this._dateRangeOld = this._dateRange;
      this._backDateRange = [start, end];
    }
  }

  _platformChange(value: any) {
    if (!this.isList) {
      this._filter.sdkChange = false;
      this._filter.dateChange = false;
      this._filter.platformChange = true;
      this.onFilterBack();
    }
  }

  _sdkSourceChange(value: any) {
    if (this._appSdkSource && value !== this._appSdkSource.id) {
      this._filter.platform = '';
    }
    this._filter.sdkChange = true;
    this._filter.dateChange = false;
    this._filter.platformChange = false;
    this._filter.sdk = this._sdkSourceList.filter((item: any) => item.id == value)[0].dicItemAlias;
    if (!this.isList) {
      this.onFilterBack();
    } else {
      if (this._filter.sdk != 'miniprogram') {
        this._eventTypeList = this._eventTypeListCopy.filter((value: any) => value.dicItemAlias.indexOf('小程序') < 0);
      } else {
        this._eventTypeList = this._eventTypeListCopy.filter((value: any) => value.dicItemAlias != '自定义事件');
      }
      this._filter.eventTypeId = this._eventTypeList[0].id;
    }
  }

  _eventTypeChange(value: any) {}

  _clickSearch() {
    this.onFilterBack();
  }

  onFilterBack() {
    this._filter.startDate = this.globals.dateFormatNumber(this._backDateRange[0], '');
    this._filter.endDate = this.globals.dateFormatNumber(this._backDateRange[1], '');

    if (!this._filter.sdk && this._sdkSourceList && this._sdkSourceList.length > 0) {
      this._filter.sdk = this._sdkSourceList.filter((item: any) => item.id == this._filter.sdkSource)[0].dicItemAlias;
    }
    if (this.isList && this._filter.eventTypeId == '') {
      this._filter.eventTypeStr = '';
      for (let i = 1; i < this._eventTypeList.length; i++) {
        if (this._filter.eventTypeStr) {
          this._filter.eventTypeStr += ',' + this._eventTypeList[i].id;
        } else {
          this._filter.eventTypeStr += this._eventTypeList[i].id;
        }
      }
    }
    this.onFilter.emit(this._filter);
  }

  _formatNumber(value: any) {
    let res = null;
    if (value) {
      res = parseFloat(value);
    }
    return res;
  }

  _initFilter() {
    if (this._data) {
      if (this._data.startDate && this._data.endDate) {
        const startDate = new Date(format(this._data.startDate, 'YYYY-MM-DD'));
        const endDate = new Date(format(this._data.endDate, 'YYYY-MM-DD'));
        this._dateRange = [startDate, endDate];
        this.onBackDateRange();
      }
      this._filter = {
        startDate: this._data.startDate || null,
        endDate: this._data.endDate || null,
        platform: this._formatNumber(this._data.platform),
        sdkSource: this._formatNumber(this._data.sdkSource),
        eventTypeId: this._formatNumber(this._data.eventTypeId)
      };
      if (!this.isList) {
        this.onFilterBack();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this._data = changes.data.currentValue;
      this._initFilter();
    }
  }

  ngOnInit(): void {}
}
