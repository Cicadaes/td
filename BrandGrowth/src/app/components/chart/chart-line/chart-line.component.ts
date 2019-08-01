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
  selector: 'chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.less'],
})

export class ChartLineComponent implements OnChanges, OnInit, OnDestroy {
  // 拓展项元素
  @ContentChild('chartExpand') chartExpand: TemplateRef<void>;
  // 图表DOM
  @ViewChild('lineChart') lineChart: ElementRef;

  /*
   * 变量及参数
   */
  @Input() config: any; // 图表 option 参数

  // 是否为Mini图 默认 false
  private _mini = false;
  @Input()
  set mini(value: boolean) {
    this._mini = toBoolean(value);
  }
  get mini() {
    return this._mini;
  }

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
  private _myChart: any;

  /*
   * 事件 
   */
  // merge config 合并图表option数据
  private _myChartOption: any = {};
  setChartOption() {
    const addConfig = _.merge({}, this.config);
    // 图表 grid参数
    const _grid = {
      top: this.mini ? 0 : 36,
      left: this.mini ? 0 : 40,
      right: this.mini ? 0 : 8,
      bottom: this.mini ? 0 : 24,
    };
    // 折线图默认series的样式
    const _lineStyle = {
      type: 'line',
      smooth: !this.mini,
      smoothMonotone: 'x',
      symbolSize: 5,
      symbol: 'emptyCircle',
      showSymbol: false,
      lineStyle: {
        width: 2,
      },
      itemStyle: {
        borderWidth: 2,
      },
      markLine: {
        lineStyle: {
          emphasis: {
            width: 1,
            color: 'red',
          },
        },
      },
      label: {
        formatter: '{a}, {b}, {c}',
      },
      connectNulls: false,
      clipOverflow: false,
    };
    // 柱状图默认series的样式
    const _barStyle = {
      barWidth: 20,
    };

    // 默认的图表参数
    const _chartOption = {
      color: Colors,
      legend: this.mini ? {
        show: false,
      } : Legend,
      tooltip: Tooltip,
      grid: _grid,
    };
    const areaStyle = {
      areaStyle: {
        opacity: 0.15,
      },
    };
    const miniY = this.mini ? {
      splitLine: {
        show: false,
      },
    } : null;
    // merge series
    if (!!this.config.series && _.isArray(this.config.series)) {
      const area = this.config.series.length > 1 ? {} : areaStyle;
      this.config.series.forEach((item: any, index: number) => {
        if (!item.type || item.type === 'line') {
          addConfig.series[index] = _.merge({}, _lineStyle, area, item);
          if (addConfig.series.data && addConfig.series[index].data.length === 1) {
            addConfig.series[index].showSymbol = true;
          }
        } else if (!!item.type && item.type === 'bar') {
          addConfig.series[index] = _.merge({}, _barStyle, item);
        }
      });
    } else {
      if (!addConfig.series.type || addConfig.series.type === 'line') {
        addConfig.series = _.merge({}, _lineStyle, areaStyle, addConfig.series);
        if (addConfig.series.data && addConfig.series.data.length === 1) {
          addConfig.series.showSymbol = true;
        }
      } else if (!!addConfig.series.type && addConfig.series.type === 'bar') {
        addConfig.series = _.merge({}, _barStyle, addConfig.series);
      }
    }

    // merge xAxis
    if (!!this.config.xAxis && _.isArray(this.config.xAxis)) {
      this.config.xAxis.forEach((item: any, index: number) => {
        addConfig.xAxis[index] = _.merge({}, xAxis, item);
      });
    } else {
      addConfig.xAxis =  _.merge({}, xAxis, addConfig.xAxis);
    }

    // merge yAxis
    if (!!this.config.yAxis && _.isArray(this.config.yAxis)) {
      this.config.yAxis.forEach((item: any, index: number) => {
        addConfig.yAxis[index] = _.merge({}, yAxis, miniY, item);
      });
    } else {
      addConfig.yAxis =  _.merge({}, yAxis, miniY, addConfig.yAxis);
    }

    /* if (!this.mini && addConfig.legend.data && addConfig.legend.data.length > 0 ) {
      addConfig.legend.left = addConfig.legend.data.length === 1 ? null : 50;
    } */
    
    const option = _.merge({}, _chartOption, addConfig);
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

};
