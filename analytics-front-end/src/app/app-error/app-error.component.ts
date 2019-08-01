import { Component, Injector, OnInit } from '@angular/core';
import { AppErrorService } from './app-error.service';
import { AppErrorBase } from './app-error-base';

@Component({
  selector: 'app-app-error',
  templateUrl: './app-error.component.html',
  styleUrls: ['./app-error.component.less']
})
export class AppErrorComponent extends AppErrorBase implements OnInit {
  overviewOptions = {};
  overviewLoad = true;
  tendOptions = {};
  tendLoad = true;
  topOptions = {};
  topLoad = true;
  parmas: any;
  filterType = '_td_channel';
  searchValue: any;
  pageIndex = 1;
  pageSize = 10;
  loading = true;
  tableData: any = [];
  order: any;
  total: any;
  queryListParams: any = {};

  constructor(private injector: Injector, private appErrorService: AppErrorService) {
    super(injector);
    this.initRouterList('APP错误分析');
  }

  ngOnInit() {
    this.appErrorService.clearParentDate();
    this.search();
    this.overviewOptions = {
      title: '数据概览',
      popover: [
        {
          label: '错误次数',
          value: '所选时间范围内，错误发生的总次数。'
        },
        {
          label: '错误率',
          value: '所选时间范围内，错误次数/启动次数。'
        },
        {
          label: '影响用户数',
          value: '所选时间范围内，发生错误的用户数。'
        },
        {
          label: '影响用户率',
          value: '所选时间范围内，影响用户数/活跃用户数。'
        }
      ]
    };
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
      endDate: new Date(this.dateRange[1]).getTime()
    };

    this.queryListParams = Object.assign(this.parmas);
    this.overviewLoad = this.tendLoad = this.topLoad = true;
    this.getOverview(this.parmas);
    this.getTend(this.parmas);
    this.getTop(this.parmas);
    this.getList(this.parmas);
  }

  // 获取数据概览
  getOverview(parmas: any) {
    this.appErrorService.getErrorOverview(parmas).subscribe((response: any) => {
      this.overviewLoad = false;
      if (response.success) {
        if (Object.keys(response.data).length) {
          this.overviewOptions['data'] = [
            {
              label: '错误次数',
              value: response.data.errorTimes.toLocaleString()
            },
            {
              label: '错误率',
              value: (response.data.errorRatio * 100).toFixed(2) + '%'
            },
            {
              label: '影响用户数',
              value: response.data.affectUsers.toLocaleString()
            },
            {
              label: '影响用户率',
              value: (response.data.affectRatio * 100).toFixed(2) + '%'
            }
          ];
        }
      }
    });
  }

  // 获取数据趋势
  getTend(parmas: any) {
    this.appErrorService.getErrorTendency(parmas).subscribe((response: any) => {
      this.tendLoad = false;
      if (response.success) {
        if (Object.keys(response.data).length) {
          this.tendOptions = response.data;
        } else {
          this.tendOptions = this.tendNoData;
        }
      } else {
        this.tendOptions = this.tendNoData;
      }
    });
  }

  // 获取top10的错误数据
  getTop(parmas: any) {
    const queryObj = {};
    queryObj['dimension'] = this.filterType;
    for (const key in parmas) {
      if (parmas.hasOwnProperty(key)) {
        queryObj[key] = parmas[key];
      }
    }
    this.topLoad = true;

    this.appErrorService.getErrorTop(queryObj).subscribe((response: any) => {
      this.topLoad = false;
      if (response.success) {
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
    this.loading = true;
    const queryObj = {};
    if (reset) {
      this.pageIndex = 1;
    }
    queryObj['page'] = this.pageIndex;
    queryObj['limit'] = this.pageSize;

    for (const key in this.queryListParams) {
      if (this.queryListParams.hasOwnProperty(key)) {
        queryObj[key] = this.queryListParams[key];
      }
    }

    if (queryObj.hasOwnProperty('pattern') && queryObj['pattern'] === '') {
      delete queryObj['pattern'];
    }

    this.appErrorService.getErrorList(queryObj).subscribe((response: any) => {
      if (response.success) {
        this.loading = false;
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

  // 列表导出
  downloadData() {
    const that = this;
    const json = Object.assign(this.queryListParams);
    delete json['page'];
    json['limit'] = -1;
    that.appErrorService.download(json).subscribe((response: any) => {});
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  // 子组件改变请求参数
  changeGetTop(type: any) {
    this.filterType = type;
    this.getTop(this.parmas);
  }

  // 查看错误详情
  detail(data: any): void {
    this.appErrorService.setParentDate(this.dateRange);

    this.goInto({
      name: '',
      url: '/app-error/detail',
      params: {
        digest: data.digest
      }
    });
  }
}
