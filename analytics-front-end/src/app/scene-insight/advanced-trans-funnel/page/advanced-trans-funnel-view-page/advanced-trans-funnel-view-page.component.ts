import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AdvancedTransFunnelService } from '../../advanced-trans-funnel.service';
import { BaseComponent } from '../../../../common/base-component';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../../../common/config/page.size.config';
import { FormBuilder } from '@angular/forms';
import { ChartComponent } from '../../../../common/chart/chart.component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-advanced-trans-funnel-view-page',
  templateUrl: './advanced-trans-funnel-view-page.component.html',
  styleUrls: ['./advanced-trans-funnel-view-page.component.less']
})
export class AdvancedTransFunnelViewPageComponent extends BaseComponent implements OnInit {
  @ViewChild(ChartComponent) chartComponent: ChartComponent;

  chartOption: any; // 图表数据
  _funnelOption: any;
  lineChartOption: any; // 折线图表数据
  barChartOption: any; // 柱状图表数据
  routerList: any = []; // 面包屑

  eventTypeList: any = []; // 事件类型列表
  selecteEventType: string; // 选中的事件类型
  eventTypePaging: any = {}; // 事件类型分页信息
  eventList: any = []; // 事件列表
  selectedEvent: string; // 选中的事件
  eventPaging: any = {
    page: 1,
    rows: 20
  }; // 事件分页信息
  metricList: any = []; // 指标列表
  selectedMetric: number; // 选中的指标
  dimensionList: any = []; // 维度列表
  selectedDimension: string; // 选中的维度
  leftList: any = []; // 等号左边的下拉框列表
  leftEventList: any = []; // 等号左边的下拉框 事件列表
  leftAllList: any = []; // 等号左边的下拉框 所有数据
  filterMap: any = {}; // 等号左边的下拉框map数据 key为esfieldname value为displayType
  leftSelectfirst: string;
  rightList: any = []; // 等号右边的下拉框列表
  rightPaging: any = {}; // 等号右边的下拉框列表的分页信息
  equalList: any = []; // 等号判断下拉框列表
  moreSearchList: any = []; // 更多搜索条件
  isLoadingRightList: boolean;

  eventMap: any = {};
  metricMap: any = {};

  tableTitleList: any = [];

  dateRange: any = []; // 时间
  dateRangeOld: any;
  _dateRangeStr: string;

  detailData: any = []; // 数据明细表格
  detailDataTableLoading = false; // 数据明细表格Loading  TODO？？？
  childDetailData: any[] = [];
  childTableTitleList: any = ['总体', '漏损用户', '转化用户'];
  childDetailDataTableLoading: boolean;
  isShowChildDetailData: boolean;
  moreSearchFlag = false; // 显示更多筛选
  isVisible = false; // 保存用户分群弹框flag
  // 分页数据
  _current = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量

  pageSizeOptions: any;

  isFirst: boolean;
  isMoreEventTypeList: boolean;
  isMoreEventList: boolean;

  clausesList: any[];
  _isQueringData: boolean;
  _funnelId: any;
  _funnelOrder: any;
  _funnelName: any;
  sumProportion: any;
  _queryParams: any;
  _filter: '';
  _queryCrowDataParams: any;
  _isShowUserPage: boolean;
  _isShowUserSaveModal: boolean;
  _detailKey: string;
  _currentStep: any = {};
  _containerStyle = {
    height: '',
    overflow: 'auto'
  };

  constructor(private fb: FormBuilder, public service: AdvancedTransFunnelService, private injector: Injector) {
    super(injector);
    this._isQueringData = true;

    this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;

    const that = this;
    that._funnelId = that.route.snapshot.params['id'];
    that._funnelOrder = that.route.snapshot.params['funnelOrder'];
    that._funnelName = that.route.snapshot.params['name'];
    that._dateRangeStr = that.route.snapshot.params['dateRange'];
    that._filter = that.route.snapshot.params['filter'] || '';
    that.isFirst = true;
    that.isMoreEventTypeList = true;
    that.isMoreEventList = true;
    if (that._dateRangeStr && that._dateRangeStr.indexOf('~') !== -1) {
      const _dateRangeAttr = that._dateRangeStr.split('~');
      const startTimeFormat = this.globals.dateFormat1(_dateRangeAttr[0], '/');
      const endTimeFormat = this.globals.dateFormat1(_dateRangeAttr[1], '/');
      const startTime = new Date(startTimeFormat);
      const endTime = new Date(endTimeFormat);
      that.dateRange.push(startTime);
      that.dateRange.push(endTime);
    }
    /* else {
         const tempTime = new Date();
         const beforeTime = new Date(tempTime.getTime() - 6 * 24 * 3600 * 1000);
         // console.log('==>>', beforeTime);
         that.dateRange.push(beforeTime);
         that.dateRange.push(tempTime);
         }*/
    that.dateRangeOld = that.dateRange;
    that.eventTypePaging = {
      page: 1,
      rows: 20
    };
    this.clausesList = [
      {
        value: 'and',
        label: '且'
      },
      {
        value: 'or',
        label: '或'
      }
    ];
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
    that.equalList = [
      {
        name: '等于',
        value: '='
      },
      {
        name: '不等于',
        value: '!='
      }
    ];
    that.sumProportion = '0';
    that._funnelOption = {
      grid: {
        left: 80,
        right: 20,
        top: 30,
        bottom: 22
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 35, 61,0.85)',
        padding: 15,
        extraCssText: `height: 120px;\n    line-height: 30px;\n    padding: 15px 25px;\n    font-size: 12px;`,
        textStyle: {
          color: '#ffffff',
          decoration: 'none',
          fontFamily: '"HelveticaNeue", "PingFangSC", "微软雅黑"',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
          lineHeight: 50
        },
        axisPointer: {
          type: 'line'
        },
        show: true,
        formatter: function(params) {
          let relVal = `<span style="font-size: 14px;">${params[0].name}</span>`;
          for (let i = 0, l = params.length; i < l; i++) {
            if (i === 0) {
              relVal += `<br/><span style="line-height: 10px; display: inline-block;
              height: 6px; width: 6px; border-radius: 50%;
              margin-right: 8px; margin-bottom: 1px; background: #2D8CF0;"></span>${
                params[i].seriesName
              } : ${that.globals.toThousands(params[i].value)}`;
            } else {
              relVal += `<br/><span style="line-height: 10px; display: inline-block; height: 6px;
              width: 6px; border-radius: 50%; margin-right: 8px;
              margin-bottom: 1px; background: #2DE2C5;"></span>${params[i].seriesName} : ${params[i].value}%`;
            }
          }
          return relVal;
        }
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        },
        show: false
      },
      legend: {
        data: []
      },
      xAxis: [],
      yAxis: [
        {
          type: 'value',
          name: '',
          min: 0,
          max: 0,
          //          interval: 50,
          axisLabel: {
            formatter: function(value: any) {
              //                        console.dir([value]);
              return that.globals.toThousands(value);
            }
          },
          axisLine: {
            lineStyle: {
              color: '#17233D'
            },
            show: false
          }
        },
        {
          type: 'value',
          name: '转化率',
          min: 0,
          max: 0,
          //          interval: 5,
          axisLabel: {
            formatter: '{value} %'
          },
          show: false
        }
      ],
      series: []
    };
  }

  ngOnInit() {
    this.listenerWindownResize();
    const that = this;
    // 获取按后面下拉框列表
    that.service.getProvince().subscribe((data: any) => {
      if (data.success) {
        for (const key in data.list) {
          if (data.list.hasOwnProperty(key)) {
            const json = {
              key: key,
              value: data.list[key]
            };
            const searchData = JSON.parse(localStorage.getItem('funnel-view-search')) || {};
            if (searchData && that.getParamsId() == searchData.id) {
              that.selectedDimension = searchData.groupKey;
            }
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

  getParamsId() {
    const url = document.location.href;
    const params = url.split(';')[1];
    if (!params) {
      return '';
    } else {
      return params.split('=')[1];
    }
  }

  // 获取用户后面下拉框列表
  getProfilemetasList() {
    const that = this;
    that.service.getProfilemetasList(+that.selectedEvent).subscribe((data: any) => {
      if (data.success) {
        that.leftList = [];
        that.filterMap = {};
        for (const key in data.list) {
          if (data.list.hasOwnProperty(key)) {
            const json = {
              key: key,
              value: data.list[key]
            };
            that.leftList.push(json);
            if (key === '事件属性' || key === '页面参数') {
              that.leftEventList = data.list[key];
            }
            const tmpLength = data.list[key].length;
            for (let i = 0; i < tmpLength; i++) {
              that.filterMap[data.list[key][i].esfieldname] = data.list[key][i].displayType;
            }
          }
        }
        const searchData = JSON.parse(localStorage.getItem('funnel-view-search')) || {};
        if (searchData && that.getParamsId() == searchData.id) {
          //that.selectedDimension = searchData.groupKey;
          const dateStart = this.globals.dateFormat1(searchData.dateRange.split('~')[0], '/');
          const dateSEnd = this.globals.dateFormat1(searchData.dateRange.split('~')[1], '/');
          that.dateRange = [new Date(dateStart), new Date(dateSEnd)];
          if (searchData.queryFilters) {
            this.moreSearchFlag = !this.moreSearchFlag;
            for (let i = 0; i < searchData.queryFilters.length; i++) {
              that.moreSearchList[i] = {
                clauses: searchData.queryFilters[i].clauses || 'and',
                filter: this.leftList[0] ? this.leftList[0].value[0] : '',
                operator: searchData.queryFilters[i].operator || 'eq',
                rightList: []
              };

              for (let j = 0; j < that.leftList.length; j++) {
                for (let k = 0; k < that.leftList[j].value.length; k++) {
                  if (that.leftList[j].value[k].esfieldname == searchData.queryFilters[i].filter) {
                    that.moreSearchList[i].filter = that.leftList[j].value[k];
                  }
                }
              }

              if (searchData.queryFilters[i].displayType === 'Tag') {
                that.getRightList(i, that.moreSearchList[i], searchData.queryFilters[i].values, 999);
                that.moreSearchList[i].values = searchData.queryFilters[i].values;
              } else if (searchData.queryFilters[i].displayType === 'Date') {
                if (searchData.queryFilters[i].operator === 'range') {
                  that.moreSearchList[i].values = [
                    new Date(searchData.queryFilters[i].values[0]),
                    new Date(searchData.queryFilters[i].values[1])
                  ];
                } else {
                  that.moreSearchList[i].value = new Date(searchData.queryFilters[i].values[0]);
                }
              } else if (
                searchData.queryFilters[i].displayType === 'Integer' ||
                searchData.queryFilters[i].displayType === 'Double'
              ) {
                if (searchData.queryFilters[i].operator === 'range') {
                  that.moreSearchList[i].first = searchData.queryFilters[i].values[0];
                  that.moreSearchList[i].second = searchData.queryFilters[i].values[1];
                } else {
                  that.moreSearchList[i].values = searchData.queryFilters[i].values[0];
                }
              } else if (searchData.queryFilters[i].displayType === 'String') {
                that.moreSearchList[i].values = searchData.queryFilters[i].values[0];
              }
            }
          }
          this.search();
        } else {
          localStorage.removeItem('funnel-view-search');
          for (let i = 0; i < that.moreSearchList.length; i++) {
            if (i === 0) {
              that.moreSearchList[i] = { clauses: 'and', filter: that.leftList[0].value[0] };
            } else {
              that.moreSearchList[i] = { clauses: 'or', filter: that.leftList[0].value[0] };
            }
            that.getRightList(i, that.moreSearchList[i], []);
          }
        }
      }
    });
  }

  _arrToString(list: any[]) {
    let str = '';
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (i === list.length - 1) {
          str += list[i];
        } else {
          str += list[i] + ',';
        }
      }
    }
    return str;
  }

  // 获取最后一个下拉框列表
  getRightList(index: number, item: any, values: any[], rows?: any) {
    const that = this;
    let page = item.page;
    if (!page) {
      item.page = 1;
      page = 1;
    }
    const ids = this._arrToString(values);
    const tempJson = {
      page: page,
      rows: rows || 20,
      sort: 'create_time',
      order: 'desc',
      searchName: item.searchName || '',
      dicKey: that.moreSearchList[index].filter['esfieldname'],
      ids: ids
    };
    // if (that.isLoadingRightList) {
    //     return false;
    // }
    that.isLoadingRightList = true;
    that.service.getEventList(tempJson).subscribe(
      (data: any) => {
        that.isLoadingRightList = false;
        if (data.success) {
          item.page++;
          for (let i = 0; i < data.list.length; i++) {
            const option = that._getOptionById(data.list[i].id, that.moreSearchList[index]['rightList']);
            if (!option) {
              const json = { value: data.list[i].id, name: data.list[i].dicItemAlias };
              that.moreSearchList[index]['rightList'].push(json);
            }
          }
        }
      },
      (err: any) => {
        that.isLoadingRightList = false;
      }
    );
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
    that.service.getEventList(tmpEventJson).subscribe((result: any) => {
      if (result.success) {
        if (that.isFirst) {
          that.eventTypeList = result.list;
          that.selecteEventType = result.list[0] && result.list[0].id;

          // 获取触发下拉框列表
          that.eventList = [];
          that.eventPaging.page = 1;
          if (that.selecteEventType) {
            that.getEventList(1);
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
    this.moreSearchFlag = false;
    that.eventList = [];
    that.isMoreEventList = true;
    that.isFirst = true;
    that.eventPaging.page = 1;
    that.getEventList();
  }

  getEventList(page?: number) {
    const that = this;
    if (!that.isMoreEventList) {
      return;
    }
    const tmpJson = {
      page: page || that.eventPaging.page || 1,
      rows: that.eventPaging.rows || 10,
      dicKey: 'eventid',
      parentId: that.selecteEventType
    };
    that.eventPaging.page = tmpJson.page + 1;
    that.service.getEventList(tmpJson).subscribe((data: any) => {
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
        if (that.eventList.length >= data.total) {
          that.isMoreEventList = false;
        }
        if (!that.selectedEvent) {
          that.selectedEvent = '';
        }
        if (that.eventList.length > 0 && that.selectedEvent !== that.eventList[0].value) {
          that.selectedEvent = that.eventList[0].value;
          if (that.isFirst) {
            that.isFirst = false;
            if (localStorage.getItem('funnel-view-search') == null) {
              that.search();
            }
          }
          that.getProfilemetasList();
        }
      }
    });
  }

  changeEvent(e: any, index: number, item: any) {
    item.page = 1;
    const that = this;
    that.moreSearchList[index].filter = e;
    delete that.moreSearchList[index].values;
    delete that.moreSearchList[index].operator;
    delete that.moreSearchList[index].first;
    delete that.moreSearchList[index].second;
    // that.selectedEvent = e;
    that.moreSearchList[index].operator = 'eq';
    that.moreSearchList[index]['rightList'] = [];
    that.getRightList(index, item, []);
  }

  onSearchEventAttr(value: any, index: number, item: any) {
    item.searchName = value || '';
    item.page = 1;
    this.moreSearchList[index]['rightList'] = [];
    this.getRightList(index, item, []);
  }

  loadMore(index: number, item: any) {
    this.getRightList(index, item, []);
  }

  changeFilter(data: any) {
    data.operator = '=';
    data.values = null;
  }

  // 更多筛选
  moreSearch() {
    this.moreSearchFlag = !this.moreSearchFlag;
    if (this.moreSearchFlag) {
      this.moreSearchList = [
        {
          clauses: 'and',
          filter: this.leftList[0] ? this.leftList[0].value[0] : '',
          operator: 'eq',
          rightList: []
        }
      ];
      this.getRightList(0, this.moreSearchList, []);
    } else {
      this.search();
    }
    this.calContainerStyle();
  }

  timeChange(e: any) {
    const that = this;
    const days = that.globals.getDateDays(that.dateRange[0], that.dateRange[1]);
    if (days > 365) {
      setTimeout(() => {
        that.dateRange = that.dateRangeOld;
      }, 100);
      that.message.create('warning', '时间范围不能超过一年');
      return false;
    } else {
      that.dateRangeOld = that.dateRange;
    }
    this.search();
  }

  // 添加更多搜索条件
  add() {
    const that = this;
    that.moreSearchList.push({
      clauses: that.moreSearchList[0].clauses,
      filter: that.leftList[0] ? that.leftList[0].value[0] : '',
      operator: 'eq',
      rightList: []
    });
    that.getRightList(that.moreSearchList.length - 1, that.moreSearchList[that.moreSearchList.length - 1], []);
    this.calContainerStyle();
  }

  removeItem(index: number) {
    const that = this;
    that.moreSearchList.splice(index, 1);
    if (that.moreSearchList.length === 0) {
      that.moreSearchFlag = !that.moreSearchFlag;
      that.search();
    }
    this.calContainerStyle();
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

  checkEventFilter(esfieldname: string) {
    let eventFilter = false;
    if (this.leftEventList && this.leftEventList.length > 0) {
      for (let i = 0; i < this.leftEventList.length; i++) {
        if (this.leftEventList[i].esfieldname === esfieldname) {
          eventFilter = true;
          break;
        }
      }
    }
    return eventFilter;
  }

  rebuildQueryFilters(list: any[]) {
    const queryFilters = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const filter = {
          clauses: item.clauses,
          filter: '',
          operator: item.operator,
          values: [],
          eventFilter: false,
          displayType: ''
        };
        if (item.filter) {
          filter.eventFilter = this.checkEventFilter(item.filter['esfieldname']);
          filter.displayType = item.filter['displayType'];
          filter.filter = item.filter['esfieldname'];

          if (item.filter.displayType === 'Date') {
            const temp = [];
            if (item.operator === 'range') {
              if (item.values && item.values.length > 1) {
                temp[0] = this.globals.dateFormat(item.values[0], '');
                temp[1] = this.globals.dateFormat(item.values[1], '');
              }
            } else {
              if (item.value) {
                temp.push(this.globals.dateFormat(item.value, ''));
              }
            }
            filter.values = temp;
          } else if (item.filter.displayType === 'Integer' || item.filter.displayType === 'Double') {
            const temp = [];
            if (item.operator === 'range') {
              let first = null;
              if (item.first || item.first === 0) {
                first = item.first;
              }
              let second = null;
              if (item.second || item.second === 0) {
                second = item.second;
              }
              temp.push(first);
              temp.push(second);
            } else {
              if (item.values || item.values === 0) {
                temp.push(item.values);
              }
            }
            filter.values = temp;
          } else if (item.filter.displayType === 'Tag') {
            filter.values = item.values || [];
          } else if (item.filter.displayType === 'String') {
            if (item.values) {
              filter.values.push(item.values);
            }
          }
        }
        queryFilters.push(filter);
      }
    }
    return queryFilters;
  }

  search(e?: any, type?: any) {
    this.isShowChildDetailData = false;
    const that = this;
    if (e) {
      that.selectedDimension = e;
    }
    const json = {
      productId: that.productId,
      id: that._funnelId
    };
    //    json['eventTypeId'] = that.selecteEventType;
    const startDate = that.formatTime(that.dateRange[0]);
    const endDate = that.formatTime(that.dateRange[1]);
    json['dateRange'] = `${startDate}~${endDate}`;
    json['groupKey'] = that.selectedDimension;

    /*    json['eventId'] = that.selectedEvent;
         json['metricCode'] = that.selectedMetric;
         json['aggregationFiled'] = that.selectedDimension;*/
    if (that.moreSearchFlag) {
      json['queryFilters'] = that.rebuildQueryFilters(that.moreSearchList);
    }
    that._queryParams = json;
    that._isQueringData = true;
    that.service.search(json).subscribe(
      (data: any) => {
        console.dir([data]);
        that._isQueringData = false;
        if (data.success) {
          if (!data.list || !data.list.chart || !data.list.table) {
            return;
          }
          const seriesData = [
            {
              name: '用户',
              type: 'bar',
              barWidth: 60,
              itemStyle: {
                normal: {
                  color: '#2D8CF0',
                  label: {
                    show: true,
                    //                position: 'top',
                    formatter: function(param: any) {
                      return that.globals.toThousands(param.value);
                    }
                  }
                }
              },
              data: []
            },
            {
              name: '转化率',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: '#2DE2C5',
                  position: 'bottom',
                  label: {
                    show: true,
                    formatter: '{c}%'
                  }
                }
              },
              data: [],
              markPoint: {
                data: [],
                clickable: false,
                zlevel: 9,
                symbol: 'arrow',
                symbolSize: 1,
                itemStyle: {
                  normal: {
                    color: '#2D8CF0',
                    symbol: 'pin',
                    symbolSize: 1,
                    label: {
                      show: true,
                      position: 'left',
                      distance: 40,
                      verticalAlign: 'top',
                      rich: {
                        name: {
                          textBorderColor: '#fff'
                        }
                      },
                      formatter: function(param) {
                        return that.globals.toDecimal(param.value) + '%';
                      }
                    }
                  }
                }
              }
            }
          ];
          const xAxisData = [
            {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'line'
              },
              axisLine: {
                lineStyle: {
                  color: '#17233D'
                },
                show: false
              }
            }
          ];
          const legendData = [];
          const length = data.list && data.list.chart && data.list.chart.length;
          const tmpData = data.list.chart;
          const markPointData = [];
          that.tableTitleList[0] = '总体';
          for (let i = 0; i < length; i++) {
            const tmpDataItem = tmpData[i];
            const stepIndex = i + 1;
            const stepName = tmpDataItem.x;
            seriesData[0].data.push(tmpDataItem.y);
            seriesData[1].data.push(tmpDataItem.proportion);
            xAxisData[0].data.push(stepName);
            legendData.push(stepName);
            if (i === length - 1) {
              that.sumProportion = tmpDataItem.proportion;
            }
            that.tableTitleList[stepIndex] = stepName;

            if (i > 0) {
              const proportion = parseFloat(tmpDataItem.proportion);
              const prevProportion = parseFloat(tmpData[i - 1].proportion);
              let markPointValue = 0;
              if (prevProportion !== 0) {
                markPointValue = (proportion / prevProportion) * 100;
              }
              markPointData.push({
                name: '步骤间转化率',
                value: markPointValue,
                //                            x: xPos + '%',
                xAxis: i,
                yAxis: proportion,
                valueIndex: 0
              });
            }
          }
          seriesData[1]['markPoint']['data'] = markPointData;
          that._funnelOption.xAxis = xAxisData;
          that._funnelOption.series = seriesData;
          that._funnelOption.legend.data = legendData;
          that._funnelOption.yAxis[0].max = that.globals.getArrayMax(seriesData[0].data, '');
          that._funnelOption.yAxis[1].max = that.globals.getArrayMax(seriesData[1].data, '');
          that.chartOption = that._funnelOption;

          setTimeout(() => {
            if (that.chartComponent && that.chartComponent._chart) {
              that.chartComponent._chart.on('click', function(params) {
                if (params.componentType !== 'markPoint') {
                  that._currentStep = params;
                  const stepData = that.getStepDataByIndex(params.dataIndex, data.list.chart);
                  if (stepData) {
                    that.queryChildTableData(stepData);
                  }
                }
              });
            }
          }, 1000);
          that.detailData = data.list && data.list.table;
          const option = that._getOptionByValue(that.selectedDimension, that.dimensionList);
          if (option) {
            that.tableTitleList[0] = option.displayname;
            that.childTableTitleList[0] = option.displayname;
          }
        }
      },
      (err: any) => {
        that._isQueringData = false;
      }
    );
  }

  _getOptionByValue(value: any, groups: any[]) {
    let option;
    if (groups && groups.length > 0) {
      for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.value && group.value.length > 0) {
          const values = group.value;
          for (let j = 0; j < values.length; j++) {
            if (value === values[j].esfieldname) {
              option = values[j];
              break;
            }
          }
        }
      }
    }
    return option;
  }

  getStepDataByIndex(index: any, list: any[]) {
    let data;
    if (list && list.length > index) {
      data = list[index];
      /*for (let i = 0; i < list.length; i++) {
              if (index === i + 1) {
                data = list[i];
                break;
              }
            }*/
    }
    return data;
  }

  queryChildTableData(params: any) {
    const queryParams = this._queryParams || {};
    queryParams['currentIndex'] = params.stepId;
    console.dir([queryParams, params]);
    this.isShowChildDetailData = true;
    this.childDetailDataTableLoading = true;
    this.service.search(queryParams).subscribe(
      (data: any) => {
        this.childDetailDataTableLoading = false;
        console.dir([data]);
        if (data.success) {
          if (data.list && data.list.tableDetail) {
            this.childDetailData = data.list.tableDetail;
          }
        }
      },
      (err: any) => {
        this.childDetailDataTableLoading = false;
      }
    );
  }

  showViewPage() {
    this.isShowChildDetailData = false;
    this._queryParams['currentIndex'] = null;
  }

  downloadData() {
    const that = this;
    const json = {
      productId: that.productId
    };
    json['eventTypeId'] = that.selecteEventType;
    json['startDate'] = that.formatTime(that.dateRange[0]);
    json['endDate'] = that.formatTime(that.dateRange[1]);
    json['eventId'] = that.selectedEvent;
    json['metricCode'] = that.selectedMetric;
    json['aggregationFiled'] = that.selectedDimension;
    if (that.moreSearchFlag) {
      json['queryFilters'] = that.rebuildQueryFilters(that.moreSearchList);
    }
    const dateRangeStr = `${this.globals.dateFormat(that.dateRange[0], '')}至${this.globals.dateFormat(
      that.dateRange[1],
      ''
    )}`;
    that._queryParams['detailKey'] = '';
    let _filter = that._filter || '';
    if (_filter === 'undefined') {
      _filter = '';
    }
    const data = {
      productId: that.productId,
      type: 'conversionFunnel',
      title: `场景洞察-${_filter}高级转化漏斗-明细数据-数据导出-${dateRangeStr}`,
      param: that._queryParams
    };
    that.service.download(data).subscribe(() => {});
  }

  formatTime(time: any) {
    const date = new Date(time);
    const year = date.getFullYear();
    let month = `${date.getMonth() + 1}`;

    let day = date.getDate() + '';
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

  goToPage(pageName: string, pageUrl: string, params: any) {
    this.commonService.goInto({
      name: pageName,
      url: pageUrl,
      params: params || {}
    });
  }

  goUserPage(param: any, group: any) {
    localStorage.setItem('funnel-view-search', JSON.stringify(this._queryParams));
    const queryParams = this._queryParams;
    if (this.isShowChildDetailData) {
      queryParams['detailKey'] = param.key;
    } else {
      queryParams['currentIndex'] = param.key;
    }

    if (this.selectedDimension !== 'all') {
      queryParams['groupValue'] = group.key;
    } else {
      queryParams['groupValue'] = '';
    }
    this.goToPage('用户列表', '/scene-insight/advanced-trans-funnel/users', {
      queryParams: JSON.stringify(queryParams),
      pageSource: 'advanced-trans-funnel',
      sdkSource: this._filter
    });
  }

  showUserSaveDialog(detailKey: string) {
    this._isShowUserSaveModal = true;
    this._detailKey = detailKey;
    //      this._queryParams['detailKey'] = detailKey;
  }

  hideUserSaveModal(data: any) {
    this._isShowUserSaveModal = false;
  }

  onSubmitUserSave(data: any) {
    console.dir([data]);
  }

  changeClauses(value: any) {
    if (value) {
      this.moreSearchList.forEach(element => {
        element.clauses = value;
      });
    }
  }

  calContainerStyle(): void {
    setTimeout(() => {
      //            const filterHeader = document.getElementById('filter-header');
      const maxHeight = window.innerHeight - 70;
      this._containerStyle = {
        height: maxHeight.toString() + 'px',
        overflow: 'auto'
      };
    }, 200);
  }

  listenerWindownResize() {
    this.calContainerStyle();
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(event => {
        this.calContainerStyle();
      });
  }
}
