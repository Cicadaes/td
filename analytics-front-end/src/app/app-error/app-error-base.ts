import { BaseComponent } from 'src/app/common/base-component';
import { Injector } from '@angular/core';
import { TABLE_PAGE_SIZE_OPTIONS } from '../common/config/page.size.config';
import { EChartOption } from 'echarts';
export class AppErrorBase extends BaseComponent {
  pageOptions = TABLE_PAGE_SIZE_OPTIONS;
  productId: any;
  dateRange: any = []; // 默认时间
  tendNoData = {
    affectRatio: [],
    affectUsers: [],
    errorRatio: [],
    errorTimes: []
  };
  tenNoData = {
    errorRatio: [],
    errorTimes: []
  };

  detailTendNoData = {
    affectUsers: [],
    errorTimes: []
  };

  constructor(injector: Injector) {
    super(injector);
    this.productId = Number(this.globals.getProductIdByStorage());
    this.dateRange = [new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000), new Date()];
  }

  // 处理chart数据
  processChartData(options: EChartOption, type: boolean) {
    return this.chartMergeReturnOption('lineBar', options, type);
  }
}
