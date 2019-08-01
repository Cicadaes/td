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

// const echarts = require('echarts');
const _ = require('lodash');

@Component({
  selector: 'chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.less'],
})
export class ChartPieComponent implements OnChanges, OnInit {

  // 图表DOM
  @ViewChild('pieChart') echartsComponent: CosmosChartComponent;
  
  // 图表变量参数
  @Input() config: any;
  // 图例单位
  @Input() valueUnit: string = '%';
  
  // 图表高度 默认 150
  private _height = 150;
  @Input()
  set height(value: number) {
    this._height = value;
  }
  get height() {
    return this._height;
  }

  // 图表高度 默认 150
  private _horizontal = false;
  @Input()
  set horizontal(value: boolean) {
    this._horizontal = value;
  }
  get horizontal() {
    return this._horizontal;
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
    };
    // 默认series样式
    const _pieStyle = {
      type: 'pie',
      silent: false,
      clockwise: false,
      labelLine: {
        show: false,
      },
      hoverOffset: 5,
      radius: ['78%', '92%'],
      hoverAnimation: true,
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center',
        formatter(params: any) {
          return '{percent|' + params.percent + '%}\n{label|' + params.name + '}';
          // return '{percent|' + params.value + '%}\n{label|' + params.name + '}';
        },
        rich: {
          percent: {
            color: '#495060',
            fontSize: 24,
            padding: [5, 0],
          },
          label: {
            color: 'rgba(28,36,56,0.56)',
            fontSize: 14,
          }
        },
      },
      emphasis: {
        label: {
          show: true,
        }
      },
    };
    const addConfig = _.merge({}, this.config);

    // merge series
    if (!!this.config.series && _.isArray(this.config.series)) {
      this.config.series.forEach((item: any, index: number) => {
        addConfig.series[index] = _.merge({}, _pieStyle, item);
      });
    } else {
      addConfig.series = _.merge({}, _pieStyle, addConfig.series);
    }

    const option = _.merge({}, chartConfig, addConfig);
    this.legendData = this.setLegendOption(option);
    this._myChartOption = option;
    // this._myChart = this.echartsComponent.echarts;

    if (!!this._myChart) {
      this._myChart.on('globalout', () => {
        this.showFirstLegend();
      });
      this._myChart.on('mouseover', (event: any) => {
        this.onHoverList(event.dataIndex);
      });

      // 默认选择第一个
      setTimeout(() => {
        this.showFirstLegend();
      }, 0);
    }
  }

  setLegendOption(value: any) {
    const list: any[] = [];
    if (value && value.series) {
      const data = value.series;
      const color = value.color;
      if (!!data && _.isArray(data)) {
        data.forEach((item: any, index: number) => {
          item.data.forEach((value: any, i: number) => {
            list.push({
              color: color[i],
              name: value.name,
              value: value.value,
            });
          });
        });
      } else {
        data.data.forEach((item: any, index: number) => {
          list.push({
            color: color[index],
            name: item.name,
            value: item.value,
          });
        });
      }
    }
    return list;
  }

  private showFirst: any;
  showFirstLegend() {
    if (this._myChart) {
      this.showFirst = setTimeout(() => {
        this._myChart.dispatchAction({
          type: 'highlight',
          dataIndex: 0,
        });
      });
    }
  }

  // 图例组件事件
  private setLabel: any;
  onHoverList(index: number) {
    this.onMouseLeave(index);
    clearTimeout(this.showFirst);
    this.setLabel = setTimeout(() => {
      this._myChart.dispatchAction({
        type: 'highlight',
        dataIndex: index,
      });
    });
  }

  onMouseLeave(index: number) {
    clearTimeout(this.setLabel);
    setTimeout(() => {
      this._myChart.dispatchAction({
        type: 'downplay',
      });
    });
    this.showFirstLegend();
  }

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      'height': `${this.height}px`,
    };
  }

  chartClass: {}; // 横向排列样式
  setChartClass() {
    this.chartClass = {
      'pie-chart-box-horizontal': this.horizontal,
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const changesConfig = changes.config;
    const value = changesConfig.currentValue;
    if (this._myChart) {
      this._myChart.clear();
      this.legendData = [];
    }
    if (value !== undefined && value !== null) {
      this.setChartOption();
    }
  }

  ngOnInit() {
    this.setChartStyle();
    this.setChartClass();
  }

  ngAfterViewChecked() {
    if (!this._myChart && this.echartsComponent.echarts) {
      this._myChart = this.echartsComponent.echarts;
      this._myChart.on('globalout', () => {
        this.showFirstLegend();
      });
      this._myChart.on('mouseover', (event: any) => {
        this.onHoverList(event.dataIndex);
      });

      // 默认选择第一个
      setTimeout(() => {
        this.showFirstLegend();
      }, 0);
    }
  }
}
