import { Component, Injector, OnInit, OnChanges } from '@angular/core';
import { BusinessOverviewService } from '../business-overview.service';
import { saveMessage } from '../../utils/post-message';
import { TABLE_PAGE_SIZE_OPTIONS } from '../../common/config/page.size.config';
import { BaseComponent } from '../../common/base-component';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-sharing-report',
  templateUrl: './sharing-report.component.html',
  styleUrls: ['./sharing-report.component.less']
})
export class SharingReportComponent extends BaseComponent implements OnInit, OnChanges {
  total: number; // table列表总条数
  tableList: any[]; // 后端数据占时放这
  setTimeoutParam: any; // 用来记录setTimeout 用于处理搜索时防止一直请求
  laoding: boolean; // 是否显示loading
  page: number; // table页数
  pageSize: number; // table每页条数
  serachParam: string; // 搜索文字
  pageSizeOptions: any;

  reportUrl: any; // 报表配置url

  constructor(
    private businessOverviewService: BusinessOverviewService,
    private injector: Injector,
    private appService: AppService
  ) {
    super(injector);
    this.initRouterList('共享的报表');

    const that = this;
    that.tableList = [];
    this.total = that.tableList.length;
    that.laoding = true;
    that.page = 1;
    that.pageSize = 10;
    that.pageSizeOptions = TABLE_PAGE_SIZE_OPTIONS;
  }

  // TODO 缺少翻页时候处理
  ngOnInit() {
    const that = this;

    this.reportUrl = localStorage.getItem('share_report_url');

    that.getList();
  }

  /**
   * 获取二维码列表
   * @param page
   */
  getList(page?: number) {
    const that = this;
    if (page) {
      that.page = page;
    }
    const param = {
      page: page || that.page,
      rows: that.pageSize,
      productId: that.productId
    };
    that.laoding = true;
    that.businessOverviewService.getSharingReportList(param).subscribe((res: any) => {
      that.laoding = false;
      that.tableList = res.list;
      that.total = res.total;
    });
  }

  /**
   * 根据name搜索二维码
   */
  serachQrcode(name: string) {
    const that = this;
    that.laoding = true;
    if (that.setTimeoutParam) {
      clearTimeout(that.setTimeoutParam);
    }
    that.setTimeoutParam = setTimeout(function() {
      that.page = 1;
      that.getList();
    }, 500);
  }

  /**
   * 查看报表
   */
  viewReport(data: any) {
    const that = this;

    const aepUrl = `${window.location.origin}/aeplus/#/business-overview/sharing-report`;

    const obj = {
      report: {
        url: aepUrl,
        header: [{ name: '共享的报表', url: aepUrl }, { name: data.name, url: '' }],
        reportId: data['reportId']
      },
      cache: true
    };
    saveMessage({
      data: { report: obj }
    });
    const src = `${that.reportUrl}/studio/#/publish/${data.reportId}`;

    const token = localStorage.getItem('token');
    const product_id = localStorage.getItem('productId');
    // tslint:disable-next-line
    let param = `?product_id=${product_id}&token=${token}&custom=2&components=1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0&isShowPubStatus=0&isShowPages=0&isShowSaveTpl=0&isShowUnit=0&isFilterType=0`;
    this.appService.routerChangeMission({
      url: src + param,
      menuUrl: aepUrl,
      isIframe: true,
      newRouter: 'business-overview/studio'
    });
  }
}
