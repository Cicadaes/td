import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppErrorService } from '../app-error.service';
import { AppErrorBase } from '../app-error-base';

@Component({
  selector: 'app-error-detail',
  templateUrl: './app-error-detail.component.html',
  styleUrls: ['./app-error-detail.component.less']
})
export class AppErrorDetailComponent extends AppErrorBase implements OnInit {
  parmas: any;
  digest: any;
  summaryData = {};
  tendOptions = {};
  tendLoad: boolean = true;
  topOptions = {};
  topLoad: boolean = true;
  filterType = '_td_channel';
  searchValue: any;
  pageIndex = 1;
  pageSize = 10;
  loading: boolean = true;
  tableData: any;
  order: any;
  total: any;
  queryListParams: any = {};

  constructor(
    private injector: Injector,
    private activatedRoute: ActivatedRoute,
    private appErrorService: AppErrorService
  ) {
    super(injector);
    this.initRouterList('错误详情');
    this.activatedRoute.params.subscribe((parmas: any) => {
      this.digest = parmas['digest'];
    });
  }

  ngOnInit() {
    this.dateRange = this.appErrorService.getParentDate();
    this.search();
  }

  /**
   * 日期组件change事件
   * @param data
   */
  dataChange(data: any) {
    this.dateRange = data;
    this.search();
  }

  // 查询与时间控件联动的模块接口
  search() {
    this.parmas = {
      productId: this.productId,
      startDate: new Date(this.dateRange[0]).getTime(),
      endDate: new Date(this.dateRange[1]).getTime(),
      digest: this.digest
    };

    this.queryListParams = Object.assign(this.parmas);
    this.tendLoad = this.topLoad = true;
    this.getErrorSummary(this.parmas);
    this.getTend(this.parmas);
    this.getTop(this.parmas);
    this.getList(this.parmas);
  }

  getErrorSummary(parmas: any) {
    this.appErrorService.getErrorSummary(parmas).subscribe((response: any) => {
      if (response.success) {
        this.summaryData = response.data;
      }
    });
  }

  getTend(parmas: any) {
    this.appErrorService.getErrorDetailTendency(parmas).subscribe((response: any) => {
      this.tendLoad = false;
      if (response.success) {
        if (Object.keys(response.data).length) {
          this.tendOptions = response.data;
        } else {
          this.tendOptions = this.detailTendNoData;
        }
      } else {
        this.tendOptions = this.detailTendNoData;
      }
    });
  }

  getTop(parmas: any) {
    const queryObj = {};
    queryObj['dimension'] = this.filterType;
    for (const key in parmas) {
      if (parmas.hasOwnProperty(key)) {
        queryObj[key] = parmas[key];
      }
    }
    this.topLoad = true;

    this.appErrorService.getErrorDetailTop(queryObj).subscribe((response: any) => {
      if (response.success) {
        this.topLoad = false;
        if (Object.keys(response.data).length) {
          this.topOptions = response.data;
        } else {
          this.topOptions = this.tenNoData;
        }
      } else {
        this.topOptions = this.tenNoData;
      }
    });
  }

  // 获取错误list数据
  getList(reset = false) {
    const queryObj = {};
    this.loading = true;

    if (reset) {
      this.pageIndex = 1;
    }
    queryObj['page'] = this.pageIndex;
    queryObj['limit'] = this.pageSize;

    for (const key in this.queryListParams) {
      if (this.queryListParams.hasOwnProperty(key) && this.queryListParams[key]) {
        queryObj[key] = this.queryListParams[key];
      }
    }

    this.appErrorService.getErrorDetailList(queryObj).subscribe((response: any) => {
      this.loading = false;
      if (response.success) {
        this.tableData = response.list;
        this.total = response.total;
      }
    });
  }

  // 错误列表的排序
  sort(sort: { key: string; value: string }): void {
    if (sort && sort.value) {
      if (this.order === sort.value) {
        return;
      }

      this.order = sort.value;
      this.queryListParams['indicator'] = sort.key;

      if (sort.value === 'descend') {
        this.queryListParams['order'] = 'desc';
      } else {
        this.queryListParams['order'] = 'asc';
      }

      if (this.searchValue) {
        this.queryListParams['pattern'] = this.searchValue;
      }
      this.getList();
    } else {
      if (sort && !sort.value) {
        if (this.queryListParams.hasOwnProperty('indicator') && this.queryListParams['indicator'] === sort.key) {
          delete this.queryListParams['indicator'];
          delete this.queryListParams['order'];
          this.getList();
        }
      }
    }
  }

  // 模糊查询错误列表
  searchErrorList(value: any, type: any) {
    const that = this;
    if (type === 'click') {
      if (value !== undefined) {
        value = value;
        that.queryListParams['pattern'] = value;
        that.getList(true);
      }
    } else {
      if (value.keyCode === 13) {
        if (that.searchValue !== undefined) {
          that.searchValue = that.searchValue;
          that.queryListParams['pattern'] = that.searchValue;
          that.getList(true);
        }
      }
    }
  }

  // 子组件改变请求参数
  changeGetTop(type: any) {
    this.filterType = type;
    this.getTop(this.parmas);
  }

  // 高级筛选
  searchMore(value: any) {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (this.queryListParams.hasOwnProperty(key) && value[key] === 1) {
          delete this.queryListParams[key];
        } else if (value[key] !== 1) {
          this.queryListParams[key] = value[key];
        }
      }
    }
    this.getList();
  }

  // 列表导出
  downloadData() {
    const that = this;
    const json = Object.assign(this.queryListParams);
    delete json['page'];
    json['limit'] = -1;
    that.appErrorService.downloadDetail(json).subscribe((response: any) => {});
  }

  // 跳转数据下载页面
  goPage(hash: string) {
    this.commonService.goPage(hash);
  }
}
