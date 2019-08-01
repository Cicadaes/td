import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  ContentChild,
  ViewChild,
  TemplateRef,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { toBoolean } from '../../../utils/convert'; // 转换为Boolean

import Colors from '../../../constants/chart-common/chart-common-colors';
import Legend from '../../../constants/chart-common/chart-common-legend';
import Tooltip from '../../../constants/chart-common/chart-common-tooltip';
import xAxis from '../../../constants/chart-common/chart-common-xaxis';
import yAxis from '../../../constants/chart-common/chart-common-yaxis';

const echarts = require('echarts');
const _ = require('lodash');

@Component({
  selector: 'chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.less']
})
export class ChartBarComponent implements OnChanges, OnInit {
  // 拓展项元素
  @ContentChild('chartExpand') chartExpand: TemplateRef<void>;
  // 图表DOM
  @ViewChild('barChart') barChart: ElementRef;

  /*
   * 变量及参数
   */
  @Input() config: any; // 图表 option 参数

  // 图表高度 默认 250
  private _height = 250;
  @Input()
  set height(value: number) {
    this._height = value;
  }
  get height() {
    return this._height;
  }

  // 实例化的图表实例
  _myChart: any;
  // 图表 grid参数
  _grid = {
    top: 0,
    left: 0,
    right: 8,
    bottom: 0,
    containLabel: true,
  };

  // 柱状图默认series的样式
  _barStyle = {
    type: 'bar',
  };

  // 默认的图表参数
  _chartOption = {
    color: Colors,
    legend: Legend,
    tooltip: Tooltip,
    grid: this._grid,
  };

  /*
   * 事件 
   */
  private _myChartOption: any = {};
  // merge config 合并图表option数据
  setChartOption() {
    const addConfig = _.merge({}, this.config);

    // merge series
    if (!!this.config.series && _.isArray(this.config.series)) {
      this.config.series.forEach((item: any, index: number) => {
        addConfig.series[index] = _.merge({}, this._barStyle, item);
      });
    } else {
      addConfig.series = _.merge({}, this._barStyle, addConfig.series);
    }

    // merge xAxis
    if (!!this.config.xAxis && _.isArray(this.config.xAxis)) {
      this.config.xAxis.forEach((item: any, index: number) => {
        addConfig.xAxis[index] = _.merge({}, xAxis, item);
      });
    } else {
      addConfig.xAxis = _.merge({}, xAxis, addConfig.xAxis);
    }

    // merge yAxis
    if (!!this.config.yAxis && _.isArray(this.config.yAxis)) {
      this.config.yAxis.forEach((item: any, index: number) => {
        addConfig.yAxis[index] = _.merge({}, yAxis, item);
      });
    } else {
      addConfig.yAxis = _.merge({}, yAxis, addConfig.yAxis);
    }

    const option = _.merge({}, this._chartOption, addConfig);
    this._myChartOption = option;
  }

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      'height': `${this.height}px`,
    };
  }

  /* 
   * 生命周期
   */

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

  ngOnDestroy() {
  }
}
