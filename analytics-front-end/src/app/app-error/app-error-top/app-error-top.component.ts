import { Component, OnInit, Input, Output, EventEmitter, Injector } from '@angular/core';
import { EChartOption } from 'echarts';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppErrorBase } from '../app-error-base';

@Component({
  selector: 'app-error-top',
  templateUrl: './app-error-top.component.html',
  styleUrls: ['./app-error-top.component.less']
})
export class AppErrorTopComponent extends AppErrorBase implements OnInit {
  chartOption: EChartOption;
  chartObject: any = {};
  _topOptions: any;
  topType = 'errorTimes';
  topTypeName = '错误次数';
  radioValue = '_td_channel';
  flag = false;
  yData: any = [];

  tabList = [
    {
      label: '错误次数',
      value: 'errorTimes'
    },
    {
      label: '错误率',
      value: 'errorRatio'
    }
  ];

  searchTerms = new Subject<string>();

  @Input() set topOptions(value: any) {
    if (value && Object.keys(value).length) {
      this._topOptions = value;
      for (let key in value) {
        value[key] = value[key].reverse();
      }
      this.processData(value[this.topType]);
    }
  }

  @Input() loading: boolean;

  @Output() changeGetTop = new EventEmitter<any>();

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    const that = this;
    this.chartObject = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params, ticket, callback) {
          let str = `${that.yData[params[0].dataIndex]}<br />
            ${params[0].marker} ${params[0].seriesName} ${params[0].data}`;
          if (that.topType === 'errorRatio') {
            str = `${that.yData[params[0].dataIndex]}<br />
              ${params[0].marker} ${params[0].seriesName} ${params[0].data}%`;
          }
          return str;
        }
      },
      xAxis: {
        type: 'value',
        max: 100,
        axisLabel: {}
      },
      yAxis: {
        type: 'category'
      },
      grid: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 18,
        containLabel: true
      }
    };
    this.searchTerms
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.changeGetTop.emit(this.radioValue);
      });
  }

  // 切换过滤条件
  radioChange(value: any) {
    this.radioValue = value;
    this.searchTerms.next(this.radioValue);
  }

  // 点击错误趋势tabs时的回调
  changeTab(item: any) {
    this.topType = item.value;
    this.topTypeName = item.label;
    this.processData(this._topOptions[this.topType]);
  }

  processData(data: any) {
    this.flag = false;
    if (!data.length) {
      this.flag = true;
      return;
    }
    const yAxis = [],
      seriesData = [];
    const bgData = [];
    this.yData = [];
    let max = 0;
    data.forEach(element => {
      let key = element.key;
      if (key && key.length > 24) {
        key = key.slice(0, 24);
      }
      yAxis.push(key);
      this.yData.push(element.key);
      let value;
      if (this.topType === 'errorRatio') {
        value = (element.value * 100).toFixed(2);
      } else {
        value = element.value;
      }
      seriesData.push(value);
    });

    max = seriesData.reduce(function(a, b) {
      return Number(b) > Number(a) ? Number(b) : Number(a);
    });

    max = Math.ceil(max);
    max = max > 100 ? Math.ceil(max * 1.1) : 100;
    bgData.length = data.length;
    bgData.fill(max, 0, data.length);

    this.chartObject.xAxis['max'] = max;
    this.chartObject.yAxis['data'] = yAxis;
    this.chartObject.series = [
      {
        name: this.topTypeName,
        type: 'bar',
        data: seriesData
      },
      {
        type: 'bar',
        itemStyle: {
          normal: { color: 'rgba(0,0,0,0.05)' }
        },
        barGap: '-100%',
        barCategoryGap: '40%',
        data: bgData,
        animation: false
      }
    ];

    if (this.topType === 'errorRatio') {
      this.chartObject.xAxis['axisLabel']['formatter'] = '{value} %';
    } else {
      this.chartObject.xAxis['axisLabel']['formatter'] = '{value}';
    }

    this.chartOption = this.processChartData(this.chartObject, true);
    delete this.chartOption['legend'];
  }

  ngOnDestroy() {
    this.searchTerms.unsubscribe();
  }
}
