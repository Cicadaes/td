import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ContentChild,
  ViewChild,
  TemplateRef,
  ElementRef,
  ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { toBoolean } from '../../../utils/convert'; // 转换为Boolean
import Tooltip from '../../../constants/chart-common/chart-common-tooltip';

const echarts = require('echarts');
const _ = require('lodash');

import "echarts/map/js/china.js";

@Component({
  selector: 'chart-map',
  templateUrl: './chart-map.component.html',
  styleUrls: ['./chart-map.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartMapComponent implements OnInit {
  // 拓展项元素
  @ContentChild('chartExpand') chartExpand: TemplateRef<void>;
  // 图表DOM
  @ViewChild('lineChart') lineChart: ElementRef;

  /*
   * 变量及参数
   */
  _data: { name: string, value: number }[] = []; // 图表数据
  // _max: number = 1000; // 最大值
  // _min: number = 0; // 最小值
  _title: string = ''; // 标题

  @Input() 
  set data(list: { name: string, value: number }[]) {
    this._data = list;
  }

  get data(): { name: string, value: number }[] {
    return this._data;
  }

  /* @Input()
  set max(value: number) {
    this._max = value;
  }

  get max(): number {
    return this._max;
  }

  @Input()
  set min(value: number) {
    this._min = value;
  }

  get min(): number {
    return this._min;
  } */

  @Input()
  set title(value: string) {
    this._title = value;
  }

  get title(): string {
    return this._title;
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
  // 图表 grid参数

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      'height': `${this._height}px`,
    };
  }

  private tooltip = _.merge({}, Tooltip, { 
    trigger: 'item',
    formatter(params: any) {
      if (!params || !params.name) {
        return '';
      }
      return `
        <p>${params.name}：${params.value}</p> 
      `;
    },
   });
  private _chartOption = {
    tooltip: this.tooltip,
    visualMap: {
      type: 'piecewise',
      // min: this._min,
      // max: this._max,
      pieces: [
        {min: 1000},
        {min: 600, max: 1000},
        {min: 400, max: 600},
        {min: 100, max: 400},
        {max: 100},
      ],
      left: 'left',
      top: 'bottom',
      text: ['覆盖率（高-低）'], // 文本，默认为数值文本
      color: [ '#2D8CF0', '#5FA8F4', '#8EC1F7', '#D7E9FC', '#EEF6FE' ],
      // calculable: true,
      inverse: true,
      hoverLink: false,
      orient: 'horizontal',
      textStyle: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 12,
        color: '#495060',
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 3,
    },
    series: [
      {
        name: '省份分布',
        type: 'map',
        mapType: 'china',
        showLegendSymbol: false,
        label: {
          normal: {
            show: false,
            borderColor: 'transparent',
          },
          emphasis: {
            show: false,
            borderColor: 'transparent',
          }
        },
        itemStyle: {
          normal: {
            borderColor: '#fff',
          },
          emphasis: {
            areaColor: ['#2D8CF0'],
            borderColor: '#fff'
          }
        },
        data: this._data
      }
    ]
  };

  // merge config 合并图表option数据
  setChartOption() {
    /* if(this._max !== 1000) {
      this._chartOption.visualMap.max = this._max;
    }

    if(this._min !== 0) {
      this._chartOption.visualMap.min = this._min;
    } */

    if(this._data) {
      
      // 对省份名称数据进行处理
      const data = this._data.map((x: any) => {
        let name = x.name ? x.name.toString() : '';
        const specialProvince = {
          新疆维吾尔自治区: '新疆', // 新疆维吾尔自治区
          广西壮族自治区: '广西', // 广西壮族自治区
          内蒙古自治区: '内蒙古', // 内蒙古自治区
          宁夏回族自治区: '宁夏', // 宁夏回族自治区
          西藏自治区: '西藏', // 西藏自治区
          unknown: '未知',
        };
        name = specialProvince[name] || name.substring(0, name.length - 1);

        return {
          name,
          value: x.value,
        };
      })
      this._chartOption.series[0].data = data;
    }

    /*
      根据所得数据设置最大值与最小值区间
    */ 
    if (this._data && this._data.length > 1) {
      const sort = this._data.sort((x: any, y: any) => (y.value - x.value));
      const max = sort[0] ? sort[0].value : 100;
      const min = sort[sort.length - 1] ? sort[sort.length - 1].value : 0;
      const number = Math.ceil((max - min) / 3);

      // this._chartOption.visualMap.max = max;
      // this._chartOption.visualMap.min = min;
      if (number > 0) {
        this._chartOption.visualMap.pieces = [
          {min: max},
          {min: max - number, max},
          {min: max - (number * 2), max: max - number},
          {min: max - (number * 3), max: max - (number * 2)},
          {max: min},
        ];
      }
    }
    /* if(this._title) {
      this._chartOption.title.text = this._title;
      this._chartOption.series[0].name = this._title;
    } */

    const option = _.merge({}, this._chartOption);
    this._myChart.setOption(option);
  }
  
  constructor() { }

  /* 
   * 生命周期
   */
  ngOnChanges(changes: SimpleChanges) {
    const changesConfig = changes.data;
    const value = changesConfig.currentValue;
    if (value !== undefined && value !== null && this._myChart) {
      this.setChartOption();
    }
  }

  ngOnInit() {
    this.setChartStyle();
  }

  ngAfterViewInit() {
    this._myChart = echarts.init(this.lineChart.nativeElement);
    if (!!this._myChart) {
      this.setChartOption();
    }
  }
}
