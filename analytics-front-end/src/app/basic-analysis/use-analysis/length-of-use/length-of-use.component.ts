import { Component, OnInit, Injector, Input, SimpleChanges } from '@angular/core';
import { EChartOption } from 'echarts';
import { UseAnalysisService } from '../use-analysis.service';
import { BaseUseAnalysis } from '../base-use-analysis';

// 使用间隔常量定义
const SINGLE_USE_DURATION_DEF = {
  duration_1_3: '1秒-3秒',
  duration_4_10: '4秒-10秒',
  duration_11_30: '11秒-30秒',
  duration_31_60: '31秒-1分',
  duration_61_180: '1分-3分',
  duration_181_600: '3分-10分',
  duration_601_1800: '10分-30分',
  duration_1801: '30分以上'
};

@Component({
  selector: 'app-length-of-use',
  templateUrl: './length-of-use.component.html',
  styleUrls: ['./length-of-use.component.less']
})
export class LengthOfUseComponent extends BaseUseAnalysis implements OnInit {
  barOption: EChartOption; // 柱图配置；为null时无数据。
  lineOption: EChartOption;

  loading: boolean = false; // 线图和表格loading（因为数据是一个接口）
  barChartLoading: boolean = true; // 柱图loading

  @Input() searchParam; // 筛选参数

  constructor(public inject: Injector, public useAnalysisService: UseAnalysisService) {
    super(inject);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    let searchParam;
    if (changes.searchParam) {
      searchParam = changes.searchParam.currentValue;
      this._searchParam = changes.searchParam.currentValue;
      this.getSingleUseDurationBar(searchParam);
      this.getAvgUseDuration(searchParam);
    }
  }

  /**
   * 获取单次使用时长分布的柱状图数据
   * @param searchParam
   */
  getSingleUseDurationBar(searchParam: any) {
    let param = this.processSearchParam(searchParam);
    this.barChartLoading = true;
    this.useAnalysisService.getSingleUseDurationBar(param).subscribe(res => {
      this.barChartLoading = false;
      this.barOption = this.processBarData(res, SINGLE_USE_DURATION_DEF, prams => {
        return `${prams && prams[0].name} <br /> 启动次数: ${prams && prams[0].data.toLocaleString()}`;
      });
    });
  }

  /**
   * 获取平均使用时长的数据
   * @param searchParam
   */
  getAvgUseDuration(searchParam: any) {
    let param = this.processSearchParam(searchParam);
    this.loading = true;
    this.useAnalysisService.getAvgUseDuration(param).subscribe(res => {
      this.loading = false;
      let option = this.processLineAndTable(res, prams => {
        return `${prams[0].name} <br /> 平均单次使用时长: ${this.globals.formatSeconds(prams[0].data)}`;
      });
      if (option) {
        option.yAxis = {
          axisLine: {
            //y轴
            show: false
          },
          axisTick: {
            //y轴刻度线
            show: false
          },
          axisLabel: {
            formatter: value => {
              return this.globals.formatSeconds(value);
            }
          }
        };
      }
      this.lineOption = option;
    });
  }

  /**
   * 下载数据
   */
  downloadData() {
    let param = this.processSearchParam(this._searchParam);
    this.useAnalysisService.downloadSingleUse(param).subscribe();
  }
}
