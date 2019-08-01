import { Component, OnInit, Injector, Input, SimpleChanges } from '@angular/core';
import { EChartOption } from 'echarts';
import { BaseUseAnalysis } from '../base-use-analysis';
import { UseAnalysisService } from '../use-analysis.service';

// 使用频率次数定义
const USAGE_FREQUENCY_COUNT_DEF = {
  rate_1_2: '1-2次',
  rate_3_5: '3-5次',
  rate_6_9: '6-9次',
  rate_10_19: '10-19次',
  rate_20_49: '20-49次',
  rate_50_: '50次以上'
};

@Component({
  selector: 'app-usage-frequency',
  templateUrl: './usage-frequency.component.html',
  styleUrls: ['./usage-frequency.component.less', './../length-of-use/length-of-use.component.less']
})
export class UsageFrequencyComponent extends BaseUseAnalysis implements OnInit {
  barOption: EChartOption;
  lineOption: EChartOption;

  loading: boolean = false; // 线图和表格loading（因为数据是一个接口）
  barChartLoading: boolean = true; // 柱图loading

  @Input() searchParam;

  constructor(public inject: Injector, public useAnalysisService: UseAnalysisService) {
    super(inject);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    let searchParam;
    if (changes.searchParam) {
      searchParam = changes.searchParam.currentValue;
      this._searchParam = changes.searchParam.currentValue;
      this.getUsageAnalysisBar(searchParam);
      this.getUseRateDetail(searchParam);
    }
  }

  /**
   * 获取使用频率分布的柱状图数据
   * @param searchParam
   */
  getUsageAnalysisBar(searchParam: any) {
    let param = this.processSearchParam(searchParam);
    this.barChartLoading = true;
    this.useAnalysisService.getUsageAnalysisBar(param).subscribe(res => {
      this.barChartLoading = false;
      this.barOption = this.processBarData(res, USAGE_FREQUENCY_COUNT_DEF, function(prams) {
        return `${prams[0].name} <br /> 启动用户数: ${prams[0].data.toLocaleString()}`;
      });
    });
  }

  /**
   * 获取人均启动次数的数据
   * @param searchParam
   */
  getUseRateDetail(searchParam: any) {
    let param = this.processSearchParam(searchParam);
    this.loading = true;
    this.useAnalysisService.getUseRateDetail(param).subscribe(res => {
      this.loading = false;
      this.lineOption = this.processLineAndTable(res, prams => {
        return `${prams[0].name} <br /> 人均启动次数: ${this.globals.toDecimal(prams[0].data)}`;
      });
    });
  }

  /**
   * 下载数据
   */
  downloadData() {
    let param = this.processSearchParam(this._searchParam);
    this.useAnalysisService.downloadUseRate(param).subscribe();
  }
}
