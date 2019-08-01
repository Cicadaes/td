import { Component, OnInit, Injector, Input, SimpleChanges } from '@angular/core';
import { EChartOption } from 'echarts';
import { BaseUseAnalysis } from '../base-use-analysis';
import { UseAnalysisService } from '../use-analysis.service';

@Component({
  selector: 'app-access-depth',
  templateUrl: './access-depth.component.html',
  styleUrls: ['./access-depth.component.less', './../length-of-use/length-of-use.component.less']
})
export class AccessDepthComponent extends BaseUseAnalysis implements OnInit {
  lineOption: EChartOption;
  loading: boolean = false;

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
      this.getVisitDepthDetail(searchParam);
    }
  }

  /**
   * 获取页面折线图和表格数据
   * @param searchParam
   */
  getVisitDepthDetail(searchParam: any) {
    let param = this.processSearchParam(searchParam);
    this.loading = true;
    this.useAnalysisService.getVisitDepthDetail(param).subscribe(res => {
      this.loading = false;
      this.lineOption = this.processLineAndTable(res, prams => {
        return `${prams[0].name} <br /> 访问深度: ${this.globals.toDecimal(prams[0].data)}`;
      });
    });
  }

  /**
   * 下载数据
   */
  downloadData() {
    let param = this.processSearchParam(this._searchParam);
    this.useAnalysisService.downloadVisitDepth(param).subscribe();
  }
}
