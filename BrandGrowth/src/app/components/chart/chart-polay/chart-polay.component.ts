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

import Colors from '../../../constants/chart-common/chart-common-colors';

const echarts = require('echarts');
const _ = require('lodash');

@Component({
  selector: 'chart-polay',
  templateUrl: './chart-polay.component.html',
  styleUrls: ['./chart-polay.component.less']
})
export class ChartPolayComponent implements OnChanges, OnInit {
  
  // 图表DOM
  @ViewChild('polayChart') polayChart: ElementRef;
  // 图表变量参数
  @Input() config: any;
  // 图表数据类型 day / week
  private _type = 'day';
  @Input()
  set chartType(value: string) {
    this._type = value;
  }
  get chartType() {
    return this._type;
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

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      'height': `${this.height}px`,
    };
  }
  constructor() {}
  
  // 实例化的chart
  private _myChart: any;
  private _myChartOption: any = {};

  setChartOption() {
    // 日 的仪表盘背景样式
    const dayGauge = [
      {
        type: 'gauge',
        radius: '99%',
        startAngle: -10,
        endAngle: -60,
        splitNumber: 4,
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[1, 'rgba(28,36,56,0.80)']],
            width: 1,
            opacity: 1
          }
        },
        splitLine: {
          //分隔线样式
          show: false
        },
        axisLabel: {
          //刻度标签
          show: false
        },
        axisTick: {
          //刻度样式
          show: false
        },
        itemStyle: {
          normal: {
            opacity: 0
          }
        },
        title: {
          show: true,
          color: 'rgba(28,36,56,0.80)',
          offsetCenter: ['110%', '25%']
        },
        detail: {
          show: true,
          offsetCenter: ['95%', '0'],
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: 'rgba(28,36,56,0.56)',
          lineHeight: 14,
          formatter(value: any) {
            const str = value < 10 ? `0${value}` : value;
            return `${str}:00`;
          }
        },
        data: [
          {
            value: '18',
            name: '夜'
          }
        ]
      },
      {
        type: 'gauge',
        radius: '99%',
        startAngle: -120,
        endAngle: -170,
        splitNumber: 4,
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[1, 'rgba(28,36,56,0.80)']],
            width: 1,
            opacity: 1
          }
        },
        splitLine: {
          //分隔线样式
          show: false
        },
        axisLabel: {
          //刻度标签
          show: false
        },
        axisTick: {
          //刻度样式
          show: false
        },
        itemStyle: {
          normal: {
            opacity: 0
          }
        },
        title: {
          show: true,
          color: 'rgba(28,36,56,0.80)',
          offsetCenter: ['-110%', '25%']
        },
        detail: {
          show: true,
          offsetCenter: ['0', '90%'],
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: 'rgba(28,36,56,0.56)',
          lineHeight: 14,
          formatter(value: any) {
            const str = value < 10 ? `0${value}` : value;
            return `${str}:00`;
          }
        },
        data: [
          {
            value: '0',
            name: '夜'
          }
        ]
      },
      {
        type: 'gauge',
        radius: '99%',
        startAngle: 60,
        endAngle: 10,
        splitNumber: 4,
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[1, '#3399ff']],
            width: 1,
            opacity: 1
          }
        },
        splitLine: {
          //分隔线样式
          show: false
        },
        axisLabel: {
          //刻度标签
          show: false
        },
        axisTick: {
          //刻度样式
          show: false
        },
        itemStyle: {
          normal: {
            opacity: 0
          }
        },
        title: {
          show: true,
          color: '#3399ff',
          offsetCenter: ['-110%', '-25%']
        },
        detail: {
          show: true,
          offsetCenter: ['-95%', '0'],
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: 'rgba(28,36,56,0.56)',
          lineHeight: 14,
          formatter(value: any) {
            const str = value < 10 ? `0${value}` : value;
            return `${str}:00`;
          }
        },
        data: [
          {
            value: '6',
            name: '日'
          }
        ]
      },
      {
        type: 'gauge',
        radius: '99%',
        startAngle: 170,
        endAngle: 120,
        splitNumber: 4,
        axisLine: {
          // 坐标轴线
          lineStyle: {
            // 属性lineStyle控制线条样式
            color: [[1, '#3399ff']],
            width: 1,
            opacity: 1
          }
        },
        splitLine: {
          //分隔线样式
          show: false
        },
        axisLabel: {
          //刻度标签
          show: false
        },
        axisTick: {
          //刻度样式
          show: false
        },
        itemStyle: {
          normal: {
            opacity: 0
          }
        },
        title: {
          show: true,
          color: '#3399ff',
          offsetCenter: ['110%', '-25%']
        },
        detail: {
          show: true,
          offsetCenter: ['0', '-90%'],
          fontFamily: 'PingFangSC-Regular',
          fontSize: 12,
          color: 'rgba(28,36,56,0.56)',
          lineHeight: 14,
          formatter(value: any) {
            const str = value < 10 ? `0${value}` : value;
            return `${str}:00`;
          }
        },
        data: [
          {
            value: '12',
            name: '日'
          }
        ]
      }
    ];
    // 周 的仪表盘背景样式
    const weekGauge = [
      {
        type: 'gauge',
        radius: '99%',
        startAngle: -140,
        endAngle: 140,
        splitNumber: 4,
        axisLine: { // 坐标轴线
          lineStyle: { // 属性lineStyle控制线条样式
            color: [
              [1, '#3399ff']
            ],
            width: 1,
            opacity: 1,
          }
        },
        splitLine: { //分隔线样式
          show: false,
        },
        axisLabel: { //刻度标签
          show: false,
        },
        axisTick: { //刻度样式
          show: false,
        },
        itemStyle: {
          normal: {
            opacity: 0,
          },
        },
        title: {
          show: true,
          color: '#3399ff',
          offsetCenter: ['-120%', '0'],
        },
        detail: {
          show: false,
        },
        data: [{
          value: '',
          name: '休息日'
        }],
      }, 
      {
        type: 'gauge',
        radius: '99%',
        startAngle: 40,
        endAngle: -40,
        splitNumber: 4,
        axisLine: { // 坐标轴线
          lineStyle: { // 属性lineStyle控制线条样式
            color: [
              [1, 'rgba(28,36,56,0.80)']
            ],
            width: 1,
            opacity: 1,
          }
        },
        splitLine: { //分隔线样式
          show: false,
        },
        axisLabel: { //刻度标签
          show: false,
        },
        axisTick: { //刻度样式
          show: false,
        },
        itemStyle: {
          normal: {
            opacity: 0,
          },
        },
        title: {
          show: true,
          color: 'rgba(28,36,56,0.80)',
          offsetCenter: ['120%', '0'],
        },
        detail: {
          show: false,
        },
        data: [{
          value: '',
          name: '工作日'
        }],
      },
    ];
    const show = this.chartType === 'week';
    const gauge = !show ? dayGauge : weekGauge;
    const startAngle = show ? 130 : -83;

    const defaultOption = {
      color: Colors,
      angleAxis: {
        show,
        startAngle,
        type: 'category',
        axisLine: {
          show: false,  
        },
        axisTick: {
          show: false,  
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
          color: 'rgba(28,36,56,0.56)',
        },
      },
      radiusAxis: {
        show: false,
      },
      polar: {
        center: ['50%', '50%'],
        radius: 85,
      },
    };
    const defaultSeries = {
      type: 'bar',
      coordinateSystem: 'polar',
    };
    const addConfig = _.merge({}, this.config);
    
    // merge series
    if (!!this.config.series && _.isArray(this.config.series)) {
      this.config.series.forEach((item: any, index: number) => {
        addConfig.series[index] = _.merge({}, defaultSeries, item);
      });
      addConfig.series = gauge.concat(addConfig.series);
    } else {
      addConfig.series = _.merge({}, defaultSeries, addConfig.series);
      addConfig.series = gauge.concat(addConfig.series);
    }

    const option = _.merge({}, defaultOption, addConfig);
    this._myChartOption = option;
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesConfig = changes.config;
    const value = changesConfig && changesConfig['currentValue'];
    if (value !== undefined && value !== null) {
      this.setChartOption();
    }
  }

  ngOnInit() {
    this.setChartStyle();
  }
}
