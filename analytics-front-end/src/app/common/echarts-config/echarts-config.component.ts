import { Component, OnInit, Input, Injector, EventEmitter, Output } from '@angular/core';
import { EChartOption } from 'echarts';
import { BaseComponent } from '../../common/base-component';
import { Globals } from './../../../../src/app/utils/globals';
import { echartsConfigModule } from './echarts-config.model';

@Component({
  selector: 'app-echarts-config',
  templateUrl: './echarts-config.component.html',
  styleUrls: ['./echarts-config.component.less']
})
export class EchartsConfigComponent extends BaseComponent implements OnInit {
  echartsConfigModule: echartsConfigModule = new echartsConfigModule();
  chartOption: EChartOption; //echart-config的引用
  load: boolean = true; //loading还是暂无数据
  show: boolean; //显示数据还是其他
  constructor(private injector: Injector, private Globals: Globals) {
    super(injector);
  }
  @Input() functions: Function; //格式化Y轴与tootip的函数
  @Input() set option(option: any) {
    //图形渲染参数
    this.load = true;
    if (JSON.stringify(option) === '{}') {
      this.chartOption = {};
      this.show = false;
      this.load = false;
    } else if (option == 'loading') {
      this.chartOption = {};
      this.show = false;
      this.load = true;
    } else {
      const that = this;
      option['grid'] = this.echartsConfigModule.grid;
      option['legend'] = this.echartsConfigModule.legend;
      option['tooltip'] = this.echartsConfigModule.tooltip(that, this.functions);
      option['xAxis']['nameTextStyle'] = this.echartsConfigModule.xAxis.nameTextStyle;
      option['yAxis']['axisLabel']['fontFamily'] = this.echartsConfigModule.yAxis.axisLabel.fontFamily;
      option['yAxis']['axisLabel']['fontSize'] = this.echartsConfigModule.yAxis.axisLabel.fontSize;
      option['yAxis']['axisLabel']['color'] = this.echartsConfigModule.yAxis.axisLabel.color;
      option['yAxis']['axisLabel']['fontWeight'] = this.echartsConfigModule.yAxis.axisLabel.fontWeight;
      option['yAxis']['axisLabel']['formatter'] = function(value: any) {
        if (that.functions) {
          return that.functions(value);
        } else {
          return value;
        }
      };
      this.chartOption = this.chartMergeReturnOption('lineBar', option);
      this.show = true;
    }
  }
  ngOnInit() {
    this.chartOption = {};
    this.show = false;
    this.load = true;
  }
}
