import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorAnalysisService } from '../behavior-analysis.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-behavior-analysis-filter',
  templateUrl: './behavior-analysis-filter.component.html',
  styleUrls: ['./behavior-analysis-filter.component.less'],
  providers: [BehaviorAnalysisService]
})
export class BehaviorAnalysisFilterComponent extends BaseComponent implements OnInit {
  @Output() onSearch = new EventEmitter<any>();
  @Output() onSelectedDimension = new EventEmitter<any>();
  eventTypeList: any = []; // 事件类型列表
  selecteEventType: string; // 选中的事件类型
  eventTypePaging: any = {}; // 事件类型分页信息
  eventList: any = []; // 事件列表
  selectedEvent: string; // 选中的事件
  eventPaging: any = {
    page: 1,
    rows: 10,
    keyword: ''
  }; // 事件分页信息
  metricList: any = []; // 指标列表
  selectedMetric: number; // 选中的指标
  dimensionList: any = []; // 维度列表
  selectedDimension: string; // 选中的维度
  leftList: any = []; // 等号左边的下拉框列表
  leftAllList: any = []; // 等号左边的下拉框 所有数据
  filterMap: any = {}; // 等号左边的下拉框map数据 key为esfieldname value为displayType

  eventMap: any = {};
  metricMap: any = {};
  searchData: any;

  dateRange: any = []; // 时间
  dateRangeOld: any;
  moreSearchFlag = false; // 显示更多筛选

  isFirst: boolean;
  isMoreEventTypeList: boolean;
  isMoreEventList: boolean;
  crowdFilter: any;
  _crowdFilter: any = {};
  _isCheckCrowdFilter: any;

  constructor(
    private fb: FormBuilder,
    public behaviorAnalysisService: BehaviorAnalysisService,
    private injector: Injector
  ) {
    super(injector);

    const that = this;
    that.isFirst = true;
    that.isMoreEventTypeList = true;
    that.isMoreEventList = true;
    const tempTime = new Date();
    const beforeTime = new Date(tempTime.getTime() - 6 * 24 * 3600 * 1000);
    that.dateRange.push(beforeTime);
    that.dateRange.push(tempTime);
    that.dateRangeOld = that.dateRange;
    that.eventTypePaging = {
      page: 1,
      rows: 20
    };
    that.metricList = [
      {
        name: '人数',
        value: 1
      },
      {
        name: '次数',
        value: 2
      },
      {
        name: '人均次数',
        value: 3
      }
    ];
    that.metricMap = {
      1: '人数',
      2: '次数',
      3: '人均次数'
    };
    that.selectedMetric = that.metricList[0].value;
  }

  ngOnInit() {
    const that = this;

    that.searchData = JSON.parse(localStorage.getItem('crowdFilter'));

    // 获取按后面下拉框列表
    that.behaviorAnalysisService.getProvince().subscribe((data: any) => {
      if (data.success) {
        for (const key in data.list) {
          if (data.list.hasOwnProperty(key)) {
            const json = {
              key: key,
              value: data.list[key]
            };
            if (!that.selectedDimension) {
              that.selectedDimension = 'all';
            }
            that.dimensionList.push(json);
            that.leftAllList = that.leftAllList.concat(data.list[key]);
          }
        }
      }
      that.getEventTypeList(1);
    });
  }

  // 获取用户后面下拉框列表
  getProfilemetasList() {
    const that = this;
    that.behaviorAnalysisService.getProfilemetasList(+that.selectedEvent).subscribe((data: any) => {
      if (data.success) {
        that.leftList = [];
        that.filterMap = {};
        for (const key in data.list) {
          if (data.list.hasOwnProperty(key)) {
            const json = {
              key: key,
              value: data.list[key]
            };
            if (json.value && json.value.length > 0) {
              for (let i = 0; i < json.value.length; i++) {
                json.value[i].groupKey = key;
              }
            }
            that.leftList.push(json);
            const tmpLength = data.list[key].length;
            for (let i = 0; i < tmpLength; i++) {
              that.filterMap[data.list[key][i].esfieldname] = data.list[key][i].displayType;
            }
          }
        }
      }
    });
  }

  _getOptionById(id: any, list: any[]) {
    let option;
    if (id && list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (id === list[i].id) {
          option = list[i];
          break;
        }
      }
    }
    return option;
  }

  getEventTypeList(page?: number) {
    const that = this;
    if (!that.isMoreEventTypeList) {
      return;
    }
    const tmpEventJson = {
      page: page || that.eventTypePaging.page + 1 || 1,
      rows: that.eventTypePaging.rows || 30,
      dicKey: 'eventtype',
      order: 'asc'
    };
    that.behaviorAnalysisService.getEventList(tmpEventJson).subscribe((result: any) => {
      if (result.success) {
        if (that.isFirst) {
          if (result.list && result.list.length > 0) {
            that.eventTypeList = result.list;
            that.selecteEventType = result.list[0] && result.list[0].id;
            // 获取触发下拉框列表
            that.eventList = [];
            that.eventPaging.page = 1;
            if (that.selecteEventType) {
              that.getEventList(1, false);
            } else {
              that.crowdFilter = JSON.parse(localStorage.getItem('crowdFilter'));
              if (that.crowdFilter && !that.crowdFilter.conditions) {
                that.search();
              }
            }
          } else {
            that.search();
          }
        } else {
          that.eventTypeList.push(result.list);
        }
        if (that.eventTypeList.length <= result.total) {
          that.isMoreEventTypeList = false;
        }
      }
    });
  }

  eventTypeChange(data: any) {
    const that = this;
    that.moreSearchFlag = false;
    that.eventList = [];
    that.isMoreEventList = true;
    that.isFirst = false;
    that.eventPaging.page = 1;
    that.getEventList(1, false);
  }

  onSearchEvent(value: any) {
    this.eventPaging.page = 1;
    this.eventPaging.keyword = value || '';
    this.eventList = [];
    this.isMoreEventList = true;
    this.getEventList(1, true);
  }

  getEventList(page?: number, isSearch?: boolean, selectedEvent?: any) {
    const that = this;
    if (!that.isMoreEventList) {
      return;
    }
    const tmpJson = {
      page: page || that.eventPaging.page || 1,
      rows: that.eventPaging.rows || 10,
      dicKey: 'eventid',
      parentId: that.selecteEventType,
      searchName: that.eventPaging.keyword || '',
      id: selectedEvent || ''
    };
    that.behaviorAnalysisService.getEventList(tmpJson).subscribe((data: any) => {
      that.eventPaging.page = tmpJson.page + 1;
      if (data.success) {
        for (let i = 0; i < data.list.length; i++) {
          const json = {
            value: data.list[i].id,
            name: data.list[i].dicItemAlias,
            smartEvent: data.list[i].smartEvent
          };
          that.eventMap[data.list[i].id] = data.list[i].dicItemAlias;
          that.eventList.push(json);
        }
        //去重
        let result = [],
          obj = {};
        for (let i = 0; i < that.eventList.length; i++) {
          if (!obj[that.eventList[i].value]) {
            result.push(that.eventList[i]);
            obj[that.eventList[i].value] = true;
          }
        }
        that.eventList = result;
        //
        if (that.eventList.length >= data.total) {
          that.isMoreEventList = false;
        }

        if (!isSearch) {
          if (that.eventList.length > 0 && !selectedEvent) {
            that.selectedEvent = that.eventList[0].value || '';
          }
          if (that.isFirst) {
            that.setSearchData();
            that.isFirst = false;
          } else {
            //  this.search();
          }
          that.getProfilemetasList();
        }
      }
    });
  }

  setSearchData() {
    if (this.searchData) {
      this._crowdFilter = JSON.parse(localStorage.getItem('crowdFilter'));
      this.moreSearchFlag = this._crowdFilter.crowdFilter ? true : false;
      this.crowdFilter = this._crowdFilter.crowdFilter;
      this.dateRange = [
        new Date(this.globals.dateFormat1(this._crowdFilter.startDate, '')),
        new Date(this.globals.dateFormat1(this._crowdFilter.endDate, ''))
      ];
      this.selecteEventType = this._crowdFilter.eventTypeId;
      this.selectedEvent = this._crowdFilter.eventId;
      this.selectedMetric = this._crowdFilter.metricCode;
      this.selectedDimension = this._crowdFilter.aggregationFiled;
      this.eventList = [];
      this.isMoreEventList = true;
      this.isFirst = false;
      this.eventPaging.page = 1;
      this.getEventList(1, false, this.selectedEvent);
    }
    this.search();
  }

  changeEvent(e: any, index: number, item: any) {
    item.page = 1;
  }
  onSearchEventAttr(value: any, index: number, item: any) {
    item.searchName = value || '';
    item.page = 1;
  }

  loadMore(index: number, item: any) {}

  changeFilter(data: any) {
    data.operator = '=';
    data.values = null;
  }

  // 更多筛选
  moreSearch() {
    this.moreSearchFlag = !this.moreSearchFlag;
    localStorage.removeItem('crowdFilter');
    if (this.moreSearchFlag) {
      this.crowdFilter = undefined;
    } else {
      this._crowdFilter = {};
      this.search();
    }
    //        this.calContainerStyle();
  }

  timeChange(e: any) {
    const that = this;
    const days = that.globals.getDateDays(that.dateRange[0], that.dateRange[1]);
    if (days > 365) {
      setTimeout(() => {
        that.dateRange = that.dateRangeOld;
      }, 100);
      that.notification.create('warning', '时间范围不能超过一年', '');
      return false;
    } else {
      that.dateRangeOld = that.dateRange;
    }
    that.search();
  }

  formatterInputNumber(value: any, item: any) {
    if (value && item && item.filter) {
      if (item.filter.displayType === 'Integer' && value.toString().indexOf('.') !== -1) {
        setTimeout(() => {
          item.values = parseInt(value.toString(), 10);
        }, 10);
      }
    }
  }

  onFilter(crowdFilter: any) {
    this._crowdFilter['crowdFilter'] = crowdFilter;
    if (this._crowdFilter['crowdFilter'].isSubmit) {
      //    localStorage.setItem("crowdFilter",JSON.stringify(this._crowdFilter));
      if (this._crowdFilter['crowdFilter'].isChecked) {
        this.search();
      }
      setTimeout(() => {
        this._isCheckCrowdFilter = false;
      }, 100);
    }
  }

  clickSearch() {
    if (this.moreSearchFlag) {
      this._isCheckCrowdFilter = true;
    } else {
      this.search();
    }
  }

  search(e?: any, type?: any) {
    const that = this;
    const json = {
      productId: that.productId
    };
    if (type === 'event') {
      that.selectedEvent = e;
      that.getProfilemetasList();
      return;
    } else if (type === 'metric') {
      that.selectedMetric = e;
      return;
    } else if (type === 'dimension') {
      that.selectedDimension = e;
      that.onSelectedDimension.emit(that.selectedDimension);
      return;
    }

    json['eventTypeId'] = that.selecteEventType;
    json['startDate'] = that.formatTime(that.dateRange[0]);
    json['endDate'] = that.formatTime(that.dateRange[1]);
    json['eventId'] = that.selectedEvent;
    json['metricCode'] = that.selectedMetric;
    json['aggregationFiled'] = that.selectedDimension;
    // if (!that._crowdFilter.isSubmit) {
    //     that.moreSearchFlag = false;
    // }
    if (
      that.moreSearchFlag &&
      that._crowdFilter &&
      that._crowdFilter.crowdFilter &&
      that._crowdFilter.crowdFilter.definition
    ) {
      json['definition'] = that._crowdFilter.crowdFilter.definition;
    }
    that._crowdFilter['eventTypeId'] = that.selecteEventType;
    that._crowdFilter['startDate'] = that.formatTime(that.dateRange[0]);
    that._crowdFilter['endDate'] = that.formatTime(that.dateRange[1]);
    that._crowdFilter['eventId'] = that.selectedEvent;
    that._crowdFilter['metricCode'] = that.selectedMetric;
    that._crowdFilter['aggregationFiled'] = that.selectedDimension;
    localStorage.setItem('crowdFilter', JSON.stringify(that._crowdFilter));

    const queryAllParams = {
      json: json,
      eventMap: that.eventMap,
      selectedEvent: that.selectedEvent,
      metricMap: that.metricMap,
      selectedMetric: that.selectedMetric,
      selectedDimension: that.selectedDimension,
      dateRange: that.dateRange
    };
    that.onSearch.emit(queryAllParams);
  }

  formatTime(time: any) {
    const date = new Date(time);
    const year = date.getFullYear();
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;
    if (+month < 10) {
      month = '0' + month;
    }
    if (+day < 10) {
      day = '0' + day;
    }
    return year + month + day;
  }

  stringToDate(s: string) {
    if (s.length !== 8) {
      return '';
    }
    return `${s.substring(0, 4)}-${s.substring(4, 6)}-${s.substring(6)}`;
  }

  stringToDate2(s: string) {
    if (s.length !== 8) {
      return '';
    }
    return `${s.substring(4, 6)}/${s.substring(6)}`;
  }

  // 日期处理
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    const now = new Date();
    return current > now;
  };

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }
}
