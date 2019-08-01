import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorAnalysisService } from './behavior-analysis.service';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../common/config/page.size.config';
import { BaseComponent } from '../../common/base-component';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-behavior-analysis',
  templateUrl: './behavior-analysis.component.html',
  styleUrls: ['./behavior-analysis.component.less'],
  providers: [BehaviorAnalysisService]
})
export class BehaviorAnalysisComponent extends BaseComponent implements OnInit {
  chartOption: any; // 图表数据
  lineChartOption: any; // 折线图表数据
  barChartOption: any;
  selectedEvent: string; // 选中的事件
  metricList: any = []; // 指标列表
  selectedMetric: number; // 选中的指标
  selectedDimension: string; // 选中的维度
  eventMap: any = {};
  metricMap: any = {};
  dateRange: any = []; // 时间
  dateRangeOld: any;

  detailData: any = {}; // 数据明细表格
  detailDataTableLoading = false; // 数据明细表格Loading  TODO？？？
  detailTableData: any;
  isVisible = false; // 保存用户分群弹框flag
  // 分页数据
  _current = 1; // 当前页
  _pageSize = 10; // 每页条数
  _total = 1; // 数据总量
  pageSizeOptions: any;
  _isQueringData: boolean = false;
  _noData: boolean = false;
  _containerStyle = {
    height: '',
    overflow: 'auto'
  };
  _queryAllParams: any = {};
  _dicItems: any[];
  _showDicItems: any;
  _isBarChart: boolean;
  _isShowSetting: boolean = false; // 显示对比设置

  constructor(
    private fb: FormBuilder,
    public behaviorAnalysisService: BehaviorAnalysisService,
    private injector: Injector
  ) {
    super(injector);
    this.initRouterList('行为分析');

    this.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;

    const that = this;
    const tempTime = new Date();
    const beforeTime = new Date(tempTime.getTime() - 6 * 24 * 3600 * 1000);
    that.dateRange.push(beforeTime);
    that.dateRange.push(tempTime);
    that.dateRangeOld = that.dateRange;
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
    that.lineChartOption = {
      grid: {
        left: 10,
        right: 25,
        top: 38,
        bottom: 22
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 35, 61,0.85)',
        padding: 15,
        extraCssText: `line-height: 30px;\n  padding: 15px 25px;\n  font-size: 12px;`,
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
            res += `<br/> ${params[i].seriesName} : ${params[i].value}`;
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
        itemWidth: 10,
        itemHeight: 10,
        textStype: {
          fontSize: 12,
          color: '#676c7a'
        },
        selectedMode: false,
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
          boundaryGap: true,
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

    that.barChartOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(23, 35, 61,0.85)',
        padding: 15,
        extraCssText: `height: 90px;\n  line-height: 30px;\n  padding: 15px 25px;\n  font-size: 12px;`,
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
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: function(params, ticket, callback) {
          let res = 'Function formatter : <br/>' + params[0].name;
          for (let i = 0, l = params.length; i < l; i++) {
            res += `'<br/>${params[i].seriesName} : ${params[i].value}`;
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
        itemWidth: 10,
        itemHeight: 10,
        textStype: {
          fontSize: 12,
          color: '#676c7a'
        },
        selectedMode: false,
        data: []
      },
      grid: {
        left: 150,
        right: 20,
        top: 38,
        bottom: 22
      },
      color: ['#3591f0'],
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
    const that = this;
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
    this._showDicItems = !this._showDicItems;
  }

  hideDicItems(value: any) {
    this._showDicItems = value;
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
      this.onSearchApi();
    }
  }

  _formatDate(list: any) {
    const result = [];
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        result.push(this.globals.dateFormat1(list[i], '-'));
      }
    }
    return result;
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
        result.xAxisData = data['date'] || [];
      }
      if (data.series && data.series.length > 0) {
        for (let i = 0; i < data.series.length; i++) {
          const ser = data.series[i];
          result.legendData.push(ser.name || '');
          result.seriesData.push({
            name: ser.name || '',
            data: ser.data || [],
            type: type || 'line'
            //                       stack: '',
          });
        }
      }
    }
    return result;
  }

  _checkIsBarChart(param: any) {
    if (param.aggregationFiled === 'all') {
      this._isBarChart = false;
    } else {
      if (this._dicItems && this._dicItems.length > 0) {
        this._isBarChart = false;
      } else {
        this._isBarChart = true;
      }
    }
  }

  onSelectedDimension(value: any) {
    this.selectedDimension = value;
    this._queryAllParams.json['aggregationFiled'] = value;
  }

  onSearchApi() {
    const that = this;
    that.hideDicItems(false);
    const param = that._queryAllParams.json || {};
    if (this._dicItems && this._dicItems.length > 0) {
      param.dicItems = this._dicItems;
    } else {
      param.dicItems = [];
    }
    that._checkIsBarChart(param);
    setTimeout(() => {
      that._isShowSetting = that.selectedDimension && that.selectedDimension != 'all' ? true : false;
    }, 100);

    setTimeout(() => {
      that._isQueringData = true;
    }, 10);
    that.behaviorAnalysisService.search(param).subscribe(
      (response: any) => {
        if (response.success) {
          that._isQueringData = false;
          if (!response.data || !response.data.chart || !response.data.table) {
            that.chartOption = null;
            that.detailData = {};
            that._noData = true;
            return;
          }
          if (this._isBarChart) {
            const chartData = that._buildChartData(response.data.chart, 'bar');
            that.barChartOption.legend.data = chartData.legendData;
            that.barChartOption.yAxis[0].data = chartData.xAxisData;
            that.barChartOption.series = chartData.seriesData;
            that.chartOption = JSON.parse(JSON.stringify(that.barChartOption));
          } else {
            const chartData = that._buildChartData(response.data.chart, 'line');
            that.lineChartOption.legend.data = chartData.legendData;
            that.lineChartOption.xAxis[0].data = chartData.xAxisData;
            that.lineChartOption.series = chartData.seriesData;
            that.chartOption = JSON.parse(JSON.stringify(that.lineChartOption));
          }
          const table = response.data.table;
          that.detailData = table;
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
    that.selectedDimension = that._queryAllParams.selectedDimension;
    that.dateRange = that._queryAllParams.dateRange;
    this._dicItems = null;
    this.onSearchApi();
  }

  downloadData() {
    const that = this;
    const json = that._queryAllParams.json;
    const dateRangeStr = `${this.globals.dateFormat(that.dateRange[0], '')}至${this.globals.dateFormat(
      that.dateRange[1],
      ''
    )}`;
    const data = {
      productId: that.productId,
      type: 'behavior',
      title: `基础分析-行为分析-明细数据-数据导出-${dateRangeStr}`,
      param: json
    };
    that.behaviorAnalysisService.download(data).subscribe(() => {});
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

  goPage(hash: string) {
    this.commonService.goPage(hash);
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

  goToPage(pageName: string, pageUrl: string, params: any) {
    this.commonService.goInto({
      name: pageName,
      url: pageUrl,
      params: params || {}
    });
  }

  _getItemByIndex(list: any[], index: any) {
    let item;
    if (list && list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        if (i === index) {
          item = list[i];
          break;
        }
      }
    }
    return item;
  }

  goUserPage(data: any, index: any) {
    const queryParams = this._queryAllParams.json || {};
    if (this._isBarChart) {
      queryParams.dicItems = [data[0]];
    } else {
      queryParams.startDate = data[0];
      queryParams.endDate = data[0];
      const item = this._getItemByIndex(this.detailData.head, index);
      if (item && item.id) {
        queryParams.dicItems = [item.id];
      }
    }
    this.goToPage('用户列表', '/scene-insight/advanced-trans-funnel/users', {
      queryParams: JSON.stringify(queryParams),
      pageSource: 'behavior-analysis'
    });
  }
}
