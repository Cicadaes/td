import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  SimpleChanges
} from '@angular/core';

import Colors from '../../../constants/chart-common/chart-common-colors';

const d3Chart = require('d3');
const vennJs = require('venn.js');

@Component({
  selector: 'chart-venn',
  templateUrl: './chart-venn.component.html',
  styleUrls: ['./chart-venn.component.less']
})
export class ChartVennComponent implements OnChanges, OnInit {
  // 图表DOM
  @ViewChild('vennChart') vennChart: ElementRef;
  // 图表变量参数
  @Input() config: any;
  @Input() vennId: string = 'chart-venn';

  // 图表与图例排列方式
  private _horizontal = false;
  @Input()
  set horizontal(value: boolean) {
    this._horizontal = value;
  }
  get horizontal() {
    return this._horizontal;
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

  // 图表宽度 默认 265
  private _width = this.horizontal ? 175 : 265;
  @Input()
  set width(value: number) {
    this._width = value;
  }
  get width() {
    return this._width;
  }

  // 渲染图表
  setChartOption() {
    const list: any[] = [];
    // 初始化 venn图宽高及padding值
    this._myChart = vennJs.VennDiagram();
    this._myChart.width(this.width);
    this._myChart.height(this.height);
    this._myChart.padding(8);
    const chartDom = d3Chart.select(`#${this.vennId}`);
    // 渲染
    chartDom.datum(this.config).call(this._myChart);
    // 替换默认图形颜色
    d3Chart.selectAll(`#${this.vennId} .venn-circle path`)
      .style('fill', (item: any, i: any) => { 
        list[i] = {
          color: Colors[i],
          opacity: 0.65,
          name: item.sets[0],
          value: item.size,
        };
        return Colors[i];
      });
    // 替换默认文字颜色
    d3Chart.selectAll(`#${this.vennId} .venn-circle text`)
      .style('fill', (d: any, i: any) => { 
        return Colors[i];
      }).style('display', 'none');

    // 设置 tooltip DOM及样式 class无法生效 TODO
    const tooltip = d3Chart.select('body').append('div')
      .attr('class', 'venntooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(255,255,255,0.95)')
      .style('color', '#868da0')
      // .style('white-space', 'nowrap')
      .style('display', 'none')
      .style('min-width', '150px')
      .style('font-size', '14px')
      .style('padding', '16px 18px')
      .style('border', '1px solid #DDDEE1')
      .style('border-radius', '4px');
    chartDom.selectAll('path')
      .style('stroke-opacity', 0)
      .style('stroke', '#fff')
      .style('stroke-width', 1);

    chartDom.selectAll('g')
      .on('mouseover', function(d: any, i: any) {
        vennJs.sortAreas(chartDom, d);
        tooltip.transition().duration(400).style('opacity', 1);
        const title = d.sets.join(' ∩ '); // 使用 ∩ 将名称分割
        tooltip.text(title);
        tooltip.append('b').text(d.size).style('margin-left', '16px'); // 展示数值

        var selection = d3Chart.select(this).transition('tooltip').duration(400);
        selection.select('path')
          .style('fill-opacity', d.sets.length == 1 ? 0.4 : 0.1)
          .style('stroke-opacity', 1);
      })
      .on('mousemove', function() {
        tooltip.style('display', 'block')
          .style('left', (d3Chart.event.pageX + 16) + 'px')
          .style('top', (d3Chart.event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d: any, i: any) {
        tooltip.transition().duration(400).style('opacity', 0);
        var selection = d3Chart.select(this).transition('tooltip').duration(400);
        selection.select('path')
          .style('fill-opacity', d.sets.length == 1 ? 0.25 : 0)
          .style('stroke-opacity', 0);
      });
    this.legendData = list;
  }

  chartStyle: {}; // 图表样式
  setChartStyle() {
    this.chartStyle = {
      height: `${this.height}px`,
    };
  }
  chartClass: {}; // 横向排列样式
  setChartClass() {
    this.chartClass = {
      'chart-venn-box-horizontal': this.horizontal,
    }
  }

  // 实例化的chart
  private _myChart: any;
  private legendData: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const changesConfig = changes.config;
    const value = changesConfig.currentValue;
    if (value !== undefined && value !== null && value.length > 0) {
      this.setChartOption();
    }
  }

  ngOnInit() {
    this.setChartStyle();
    this.setChartClass();
  }
}
