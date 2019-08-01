import { Component, Injector, OnInit } from '@angular/core';
import { EventAnalysisService } from '../event-analysis.service';
import { BaseComponent } from '../../../common/base-component';
import { fromEvent } from 'rxjs/index';
import { debounceTime } from 'rxjs/operators';
import { format } from 'date-fns';

@Component({
  selector: 'app-event-analysis-detail',
  templateUrl: './event-analysis-detail.component.html',
  styleUrls: ['./event-analysis-detail.component.less'],
  providers: [EventAnalysisService]
})
export class EventAnalysisDetailComponent extends BaseComponent implements OnInit {
  chartOption: any; // 图表数据
  lineChartOption: any; // 折线图表数据
  barChartOption: any;
  selectedEvent: string; // 选中的事件
  selectedEventLabel: string;
  metricList: any = []; // 指标列表
  selectedMetric: number; // 选中的指标
  selectedMetricLabel: any;
  selectedDimension: string; // 选中的维度
  eventMap: any = {};
  metricMap: any = {};
  eventContrastMap: any = {};
  selectedEventContrast: string; // 选中的对比事件
  selectedEventContrastLabel: string;
  detailData: any = {}; // 数据明细表格
  _isQueringData: boolean = false;
  _noData: boolean = false;
  _isContrast: boolean = false;
  _isSearchLoading: boolean = false;
  _containerStyle = {
    height: '',
    overflow: 'auto'
  };
  _queryAllParams: any = {};
  _dicItems: any[];
  _showDicItems: any = {};
  _chartType: any;
  _isShowSetting: boolean = false; // 显示对比设置
  _detailTabShow: boolean = false; // 显示明细数据Tab
  _maxLength: boolean = false; // 设置里最多可选数
  _isSearch: boolean;
  _currentDetailTab: any;
  _detailTabs: any[];
  _isQueryTags: boolean;
  _isQueryEventAttrs: boolean;
  _searchValue: any;
  _helpPopover: any = {
    width: {
      width: '90px'
    },
    paddingLeft: {
      'padding-left': '90px'
    },
    list1: [
      {
        label: '触发用户数',
        des: '某个事件的触发用户数。'
      }
    ],
    list2: [
      {
        label: '触发次数',
        des: '某个事件的触发次数。'
      }
    ],
    list3: [
      {
        label: '人均次数',
        des: '某个事件平均每人触发的次数。人均次数=触发次数/人数。'
      }
    ],
    list4: [
      {
        label: '触发次数',
        des: '某个带标签的事件的触发次数。'
      },
      {
        label: '触发用户数',
        des: '某个带标签的事件的触发用户数。'
      }
    ],
    list5: [
      {
        label: '触发次数',
        des: '事件的不同参数触发总数。'
      },
      {
        label: '触发用户数',
        des: '事件的不同参数触发用户数。'
      }
    ]
  };
  _downloadParams: any;
  constructor(public service: EventAnalysisService, private injector: Injector) {
    super(injector);
    this.initRouterList('事件趋势');
    this._resetDetailTab();
    this.metricList = [
      {
        name: '触发用户数',
        value: 1
      },
      {
        name: '触发次数',
        value: 2
      },
      {
        name: '人均次数',
        value: 3
      }
    ];
    this.metricMap = {
      1: '触发用户数',
      2: '触发次数',
      3: '人均次数'
    };
    this.selectedMetric = this.metricList[0].value;
    this.lineChartOption = {
      grid: {
        left: 'left',
        right: '16',
        top: 38,
        bottom: 22,
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 35, 61,0.85)',
        padding: 15,
        extraCssText: `line-height: 30px;padding: 15px 25px;font-size: 12px;`,
        textStyle: {
          color: '#ffffff',
          decoration: 'none',
          fontFamily: '"HelveticaNeue", "PingFangSC", "微软雅黑"',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
          lineHeight: 50
        },
        formatter: function(params, ticket, callback) {
          let res = `Function formatter : <br/>${params[0].name}`;
          for (let i = 0, l = params.length; i < l; i++) {
            res += `<br/>${params[i].seriesName} : ${params[i].value}`;
          }
          setTimeout(function() {
            // 仅为了模拟异步回调
            callback(ticket, res);
          }, 1000);
          return 'loading';
        }
      },
      legend: {
        right: 0,
        top: 0,
        itemWidth: 16,
        itemHeight: 4,
        textStype: {
          fontSize: 12,
          color: '#676c7a'
        },
        selectedMode: false,
        icon: 'roundRect',
        type: 'scroll',
        data: []
      },
      color: [
        '#2D8CF0',
        '#2DE2C5',
        '#FCC45F',
        '#FF8454',
        '#DB425A',
        '#34508C',
        '#5BB6FD',
        '#56D08B',
        '#B3E768',
        '#71808F',
        '#34508C',
        '#2B85E4',
        '#1CB6FB',
        '#1BDBF5',
        '#80F2DA',
        '#C1F9D6',
        '#FCF4AE',
        '#FBE790',
        '#FFBD6E',
        '#FB7B49',
        '#DC4747',
        '#8E2943'
      ],
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              width: 2,
              color: '#dddee1'
            }
          },
          axisTick: {
            lineStyle: {
              width: 1,
              color: '#dddee1'
            }
          },
          axisLabel: {
            color: '#80848f'
          },
          splitLine: {
            lineStyle: {
              width: 1,
              color: '#e9eaec'
            }
          },
          boundaryGap: ['10%', '10%'],
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#80848f'
          },
          formatter: function($v, $i) {
            return $v / 10 + 'K';
          }
        }
      ],
      series: []
    };

    this.barChartOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 35, 61,0.85)',
        padding: 15,
        extraCssText: `line-height: 30px;padding: 15px 25px;font-size: 12px;`,
        textStyle: {
          color: '#ffffff',
          decoration: 'none',
          fontFamily: '"HelveticaNeue", "PingFangSC", "微软雅黑"',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal'
          //                    lineHeight: 50
        },
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params, ticket, callback) {
          let res = `Function formatter : <br/>${params[0].name}`;
          for (let i = 0, l = params.length; i < l; i++) {
            res += `<br/>${params[i].seriesName} : ${params[i].value}`;
          }
          setTimeout(function() {
            // 仅为了模拟异步回调
            callback(ticket, res);
          }, 1000);
          return 'loading';
        }
      },
      legend: {
        right: 0,
        top: 0,
        itemWidth: 16,
        itemHeight: 4,
        textStype: {
          fontSize: 12,
          color: '#676c7a'
        },
        selectedMode: false,
        icon: 'roundRect',
        type: 'scroll',
        data: []
      },
      grid: {
        left: 'left',
        right: '16',
        top: 38,
        bottom: 22,
        containLabel: true
      },
      color: [
        '#2D8CF0',
        '#2DE2C5',
        '#FCC45F',
        '#FF8454',
        '#DB425A',
        '#34508C',
        '#5BB6FD',
        '#56D08B',
        '#B3E768',
        '#71808F',
        '#34508C',
        '#2B85E4',
        '#1CB6FB',
        '#1BDBF5',
        '#80F2DA',
        '#C1F9D6',
        '#FCF4AE',
        '#FBE790',
        '#FFBD6E',
        '#FB7B49',
        '#DC4747',
        '#8E2943'
      ],
      xAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#80848f'
          },
          formatter: function($v, $i) {
            return $v / 10 + 'K';
          }
        }
      ],
      yAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#dddee1'
            }
          },
          axisTick: {
            lineStyle: {
              width: 1,
              color: '#dddee1'
            }
          },
          axisLabel: {
            color: '#80848f'
          },
          splitLine: {
            lineStyle: {
              color: '#e9eaec'
            }
          },

          boundaryGap: true,
          inverse: true,
          data: []
        }
      ],
      series: []
    };
  }
  ngOnInit() {
    this.listenerWindownResize();
  }

  _switchTabset(tab: any) {
    setTimeout(() => {
      this._currentDetailTab = tab;
      const param = this._buildSearchApiParam();
      this._buildDownloadParams(param);
      this._checkIsQuery();
    }, 100);
  }

  _checkIsQuery() {
    if (this._currentDetailTab.value === 'tag') {
      this._isQueryTags = true;
    }
    if (this._currentDetailTab.value === 'event-attr') {
      this._isQueryEventAttrs = true;
    }
  }

  _resetCurrentDetailTab() {
    this._currentDetailTab = this._detailTabs[0];
  }

  _resetDetailTab() {
    if (
      this._queryAllParams &&
      this._queryAllParams.json &&
      (this._queryAllParams.json.definitionEvent ||
        this._queryAllParams.json.definition ||
        this._queryAllParams.jsonContrast)
    ) {
      this._detailTabs = [
        {
          index: 0,
          value: 'event',
          label: '事件'
        }
      ];
    } else {
      this._detailTabs = [
        {
          index: 0,
          value: 'event',
          label: '事件'
        },
        {
          index: 1,
          value: 'tag',
          label: '标签'
        },
        {
          index: 2,
          value: 'event-attr',
          label: '事件属性'
        }
      ];
    }
    this._resetCurrentDetailTab();
  }

  checkEventFilter(filter: any) {
    let eventFilter = false;
    if (filter && filter['groupKey'] && filter['groupKey'] === '事件属性') {
      eventFilter = true;
    }
    return eventFilter;
  }

  showDicItems(event: Event) {
    event.stopPropagation();
    this._showDicItems = {
      show: true,
      reset: this._isSearch
    };
  }

  hideDicItems(value: any) {
    this._showDicItems = {};
  }

  _getIdsByItems(dicItems: any) {
    const ids = [];
    if (dicItems && dicItems.length > 0) {
      for (let i = 0; i < dicItems.length; i++) {
        ids.push(dicItems[i].id);
      }
    }
    return ids;
  }

  onBackDicItems(data: any) {
    this._dicItems = this._getIdsByItems(data.list);
    if (data.isSearch) {
      this._isSearchLoading = true;
      this.onSearchApi(false);
    }
  }

  _formatDate(list: any) {
    const result = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        result.push(format(list[i], 'MM/DD'));
      }
    }
    return result;
  }

  wordBreak(array: any) {
    let arr = [];
    array.forEach(element => {
      const len = element.length;
      let result = '';
      if (len > 0) {
        result = element.substr(0, 30);
        for (let i = 1; i < Math.ceil(len / 30); i++) {
          result += '\n' + element.substr(i * 30, 30);
        }
      }
      arr.push(result);
    });
    return arr;
  }

  _buildChartData(data: any, type: any) {
    const result = {
      seriesData: [],
      xAxisData: [],
      legendData: []
    };
    if (data) {
      if (type === 'line') {
        result.xAxisData = this._formatDate(data['date']) || [];
      } else if (type === 'bar') {
        result.xAxisData = this.wordBreak(data['date']) || [];
      }
      if (data.series && data.series.length > 0) {
        for (let i = 0; i < data.series.length; i++) {
          const ser = data.series[i];
          let name = '';
          const eventLabel = ser.event;
          const serName = ser.name;
          if (type === 'bar') {
            if (eventLabel) {
              name = `${eventLabel}的${this.selectedMetricLabel}`;
            } else {
              name = this.selectedMetricLabel;
            }
          } else {
            if (eventLabel) {
              name = `${eventLabel}的${serName}`;
            } else {
              name = serName;
            }
          }

          result.legendData.push(name);
          result.seriesData.push({
            name: name,
            data: ser.data || [],
            smooth: true,
            type: type || 'line'
            //                       stack: '',
          });
        }
      }
    }
    return result;
  }

  _resetChartType(param: any) {
    if (param && param.aggregationFiled === 'all') {
      this._chartType = 'line';
    } else {
      this._chartType = 'bar';
    }
  }

  _swithChartType(type: any) {
    this._chartType = type || 'bar';
    if (type == 'line' && this._isContrast) {
      this._maxLength = true;
    } else {
      this._maxLength = false;
    }
    this.onSearchApi(false);
  }

  onSelectedDimension(value: any) {
    this.selectedDimension = value;
    this._queryAllParams.json['aggregationFiled'] = value;
  }

  _buildSearchApiParam() {
    const param = [];
    param.push(this._queryAllParams.json);
    if (this._dicItems && this._dicItems.length > 0) {
      param[0].dicItems = this._dicItems;
    } else {
      param[0].dicItems = [];
    }
    param[0].type = this._chartType;

    this._isContrast = false;
    if (this._queryAllParams.jsonContrast) {
      this._isContrast = true;
      this._maxLength = this._chartType == 'line' ? true : false;
      //有对比分析
      param.push(this._queryAllParams.jsonContrast);
      if (this._dicItems && this._dicItems.length > 0) {
        param[1].dicItems = this._dicItems;
      } else {
        param[1].dicItems = [];
      }
      param[1].type = this._chartType;
      param[1].metricCode = param[0].metricCode;
    }
    if (this._maxLength) {
      param[0].dicItems = param[0].dicItems.slice(0, 5);
      param[1].dicItems = param[1].dicItems.slice(0, 5);
    }
    return param;
  }

  onSearchApi(clickSearch: any) {
    this._isSearch = clickSearch || false;
    this._searchValue = '';
    const that = this;
    that.hideDicItems(false);
    that._isShowSetting = that.selectedDimension && that.selectedDimension != 'all' ? true : false;
    that._noData = false;
    that._resetDetailTab();
    const param = this._buildSearchApiParam();
    that._buildDownloadParams(param);
    that._isQueryTags = false;
    that._isQueryEventAttrs = false;
    if (that._isQueringData) {
      return false;
    }
    that._isQueringData = true;
    that.service.search(param).subscribe(
      (response: any) => {
        that._isQueringData = false;
        if (!response.data || !response.data.chart || !response.data.table) {
          that.chartOption = null;
          that._noData = true;
          return;
        }
        if (response.success) {
          this._isSearchLoading = false;
          let chartData: any;
          if (this._chartType === 'bar') {
            chartData = that._buildChartData(response.data.chart, 'bar');

            that.barChartOption.legend.data = chartData.legendData;
            that.barChartOption.yAxis[0].data = chartData.xAxisData;
            that.barChartOption.series = chartData.seriesData;
            that.chartOption = this.deepCopy(that.barChartOption);
          } else {
            chartData = that._buildChartData(response.data.chart, 'line');
            that.lineChartOption.legend.data = chartData.legendData;
            that.lineChartOption.xAxis[0].data = chartData.xAxisData;
            that.lineChartOption.series = chartData.seriesData;
            that.chartOption = this.deepCopy(that.lineChartOption);
          }
          if (chartData.seriesData[0] && (!chartData.seriesData[0].data || chartData.seriesData[0].data.length === 0)) {
            that._noData = true;
          } else {
            that._noData = false;
          }
          const table = response.data.table;
          that.detailData = table;
          that.detailData['bodyCopy'] = table.body; //备份
        }
      },
      (err: any) => {
        that._isQueringData = false;
      }
    );
  }

  onSearch(queryAllParams: any) {
    const that = this;
    that._queryAllParams = queryAllParams || {};
    that.eventMap = that._queryAllParams.eventMap;
    that.selectedEvent = that._queryAllParams.selectedEvent;
    that.metricMap = that._queryAllParams.metricMap;
    that.selectedMetric = that._queryAllParams.selectedMetric;
    that.selectedMetricLabel = `${that.metricMap[that.selectedMetric]}`;
    that.selectedEventLabel = `${that.eventMap[that.selectedEvent]}`;
    that.eventContrastMap = that._queryAllParams.eventContrastMap ? that._queryAllParams.eventContrastMap : {};
    that.selectedEventContrast = that._queryAllParams.selectedEventContrast
      ? that._queryAllParams.selectedEventContrast
      : null;
    that.selectedEventContrastLabel = `${that.eventContrastMap[that.selectedEventContrast]}`;
    that.selectedDimension = that._queryAllParams.selectedDimension;
    that._dicItems = null;
    that._resetChartType(that._queryAllParams.json);
    this._isSearchLoading = true;
    that.onSearchApi(true);
  }

  _buildDownloadParams(param: any) {
    const that = this;
    const json = that._queryAllParams.json;
    const startDate = format(json['startDate'], 'YYYY-MM-DD');
    const endDate = format(json['endDate'], 'YYYY-MM-DD');
    const dateRangeStr = `${startDate}至${endDate}`;
    let type = 'event';
    let title = `行为分析-事件分析-明细数据-数据导出-${dateRangeStr}`;
    if (that._queryAllParams.json['aggregationFiled'] == 'all') {
      title = `行为分析-事件分析-明细数据-事件-数据导出-${dateRangeStr}`;
    }

    if (this._currentDetailTab.value === 'tag') {
      type = 'label';
      title = `行为分析-事件分析-明细数据-标签-数据导出-${dateRangeStr}`;
    } else if (this._currentDetailTab.value === 'event-attr') {
      type = 'eventAttr';
      title = `行为分析-事件分析-明细数据-事件属性-数据导出-${dateRangeStr}`;
    }
    const data = {
      productId: that.productId,
      type: type,
      title: title,
      param: param
    };
    this._downloadParams = data;
  }

  //表格按分组筛选
  tableSearch(value: any) {
    const table = this.detailData.bodyCopy || {};
    let res = {};
    this._searchValue = value;
    if (value) {
      if (this._chartType == 'bar') {
        res = table.filter((item: any) => item[1].toLowerCase().indexOf(value.toLowerCase()) > -1);
      } else {
        res = table.filter((item: any) => item[0].toLowerCase().indexOf(value.toLowerCase()) > -1);
      }
    }
    this.detailData.body = res;
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
