import {
  Component,
  Input,
  OnChanges,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';

import { CosmosChartComponent } from 'ng-cosmos-td-ui';
import { numberPercent } from '../../../utils/number-percent';

const Colors = [
  '#34508C',
  '#2B85E4',
  '#1CB6FB',
  '#1BDBF5',
  '#80F2DA',
  '#C1F9D6',
];
const _ = require('lodash');

@Component({
  selector: 'chart-treemap',
  templateUrl: './chart-treemap.component.html',
  styleUrls: ['./chart-treemap.component.less'],
})
export class ChartTreemapComponent implements OnChanges, OnInit {
  // 图表DOM
  @ViewChild('treemapChart') echartsComponent: CosmosChartComponent;

  // 图表变量参数
  @Input() config: any;

  // 图表高度 默认 265
  private _height = 265;
  @Input()
  set height(value: number) {
    this._height = value;
  }
  get height() {
    return this._height;
  }

  // 渲染图表
  private _myChartOption: any = {};
  setChartOption() {
    const defaultOption = {
      color: Colors,
      tooltip: {
        show: false,
      },
    };

    const detaultSeries = {
      type: 'treemap',
      height: 210,
      top: 0,
      bottom: 54,
      roam: false, //是否开启拖拽漫游（移动和缩放）
      // nodeClick: true, //点击节点后的行为,false无反应
      leafDepth: 1, // 层级嵌套
      label: {
        show: true,
        position: 'insideTopLeft',
        offset: [8, 8],
        formatter(a: any) {
          return `${a.name}\n\n${numberPercent((a.data.percent * 100), true)}`;
        },
        textStyle: {
          fontSize: '14',
          fontFamily: 'PingFangSC-Regular'
        }
      },
      levels: [
        {
          itemStyle: {
            borderWidth: 0,
            gapWidth: 2
          }
        },
      ],
      breadcrumb: {
        show: true,
        left: 'center',
        top: '234',
        itemStyle: {
          color: 'rgba(28,36,56,0.03)',
          borderWidth: 0,
          shadowBlur: 0,
          textStyle: {
            color: 'rgba(28,36,56,0.80)',
            fontFamily: 'HelveticaNeue'
          }
        }
      }
    };

    const addConfig = _.merge({}, this.config);
    // merge series
    if (!!this.config.series && _.isArray(this.config.series)) {
      this.config.series.forEach((item: any, index: number) => {
        addConfig.series[index] = _.merge({}, detaultSeries, item);
      });
    } else {
      addConfig.series = _.merge({}, detaultSeries, addConfig.series);
    }

    const option = _.merge({}, defaultOption, addConfig);
    this._myChartOption = option;
  }

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      height: `${this.height}px`
    };
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const changesConfig = changes.config;
    const value = changesConfig && changesConfig.currentValue;
    if (value !== undefined && value !== null) {
      this.setChartOption();
    }
  }
  
  ngOnInit() {
    this.setChartStyle();
  }
}
