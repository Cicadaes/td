import {
  Component,
  Input,
  OnInit,
  OnChanges,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';

import { CosmosChartComponent } from 'ng-cosmos-td-ui';
import Colors from '../../../constants/chart-common/chart-common-colors';

const _ = require('lodash');

@Component({
  selector: 'chart-radar',
  templateUrl: './chart-radar.component.html',
  styleUrls: ['./chart-radar.component.less']
})
export class ChartRadarComponent implements OnChanges, OnInit {

  // 图表DOM
  @ViewChild('radarChart') echartsComponent: CosmosChartComponent;
  
  // 图表变量参数
  @Input() config: any;
  
  // 图表高度 默认 320
  private _height = 320;
  @Input()
  set height(value: number) {
    this._height = value;
  }
  get height() {
    return this._height;
  }
  
  // 实例化的chart
  private _myChart: any;
  private _myChartOption: any = {};
  private legendData: any[] = [];
  constructor() { }

  // 渲染图表
  setChartOption() {
    // 默认图表样式
    const chartConfig = {
      color: Colors,
      radar: {
        radius: '80%',
        splitArea: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#eae9e9',
          },
        },
        axisLine: {
          show: false,
        },
        name: {
          fontFamily: 'PingFangSC-Regular',
          fontSize: 14,
          color: 'rgba(28,36,56,0.80)',
          lineHeight: 12,
        }
      },
    };
    // 默认series样式
    const _radarStyle = {
      type: 'radar',
      symbol: 'circle',
      symbolSize: 6,
      areaStyle: {
        normal: {
          opacity: .3,
        },
      },
    };
    const addConfig = _.merge({}, this.config);

    // merge series
    if (!!this.config.series && _.isArray(this.config.series)) {
      this.config.series.forEach((item: any, index: number) => {
        addConfig.series[index] = _.merge({}, _radarStyle, item);
      });
    } else {
      addConfig.series = _.merge({}, _radarStyle, addConfig.series);
    }

    const option = _.merge({}, chartConfig, addConfig);
    this._myChartOption = option;
    this._myChart = this.echartsComponent.echarts;
  }

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      'height': `${this.height}px`,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesConfig = changes.config;
    const value = changesConfig.currentValue;
    if (value !== undefined && value !== null) {
      this.setChartOption();
    }
  }
  ngOnInit() {
    this.setChartStyle();
  }
}

