import { Injector, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './services/common.service';
import { NzMessageService, NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { Globals } from '../utils/globals';

import * as echartsConfig from './../../../node_modules/echarts-config';
import { EChartOption } from 'echarts';
import { TABLE_PAGE_SIZE_OPTIONS } from './config/page.size.config';

const { chartMerge } = echartsConfig;

export class BaseComponent implements OnInit, OnChanges {
  protected router: Router;
  protected route: ActivatedRoute;
  protected globals: Globals;
  protected commonService: CommonService;
  protected notification: NzNotificationService;
  protected message: NzMessageService;
  protected modalService: NzModalService;

  protected productId: any;
  protected table_page_size_options: any;

  constructor(private baseInjector: Injector) {
    this.table_page_size_options = TABLE_PAGE_SIZE_OPTIONS;
    this.router = this.baseInjector.get(Router);
    this.route = this.baseInjector.get(ActivatedRoute);
    this.globals = this.baseInjector.get(Globals);
    this.commonService = this.baseInjector.get(CommonService);
    this.notification = this.baseInjector.get(NzNotificationService);
    this.message = this.baseInjector.get(NzMessageService);
    this.modalService = this.baseInjector.get(NzModalService);

    let messageDiv = document.getElementsByTagName('nz-message-container');
    if (messageDiv && messageDiv.length > 0) {
      for (let i = 0; i < messageDiv.length; i++) {
        messageDiv[i].parentElement.style.zIndex = '2000';
      }
    }

    let notificationDiv = document.getElementsByTagName('nz-notification-container');
    if (notificationDiv && notificationDiv.length > 0) {
      for (let i = 0; i < notificationDiv.length; i++) {
        notificationDiv[i].parentElement.style.zIndex = '2000';
      }
    }

    this.productId = localStorage.getItem('productId');
  }

  ngOnInit() {
    console.log(124);
  }

  ngOnChanges(changes: SimpleChanges) {}

  //初始化面包屑数据，一级页面调用
  initRouterList(navName: any) {}

  //点击返回的效果，切换到面包屑的上一级
  goBack() {
    history.back();
  }

  //跳转到子页面
  goInto(obj: any) {
    this.router.navigate([obj.url, obj.params || {}]);
  }

  //缓存当前页面参数
  cacheCurrent(params: any) {
    if (this.commonService.navList) {
      let length = this.commonService.navList.length;
      let obj = this.commonService.navList[length - 1];
      if (!obj.params) {
        obj.params = {};
      }
      Object.assign(obj.params, params);
    }
  }

  toThousandStr(data: any) {
    if (!data) {
      data = 0;
    }
    const dataStr: any = '' + data;
    const re = /\d{1,3}(?=(\d{3})+$)/g;
    const result = dataStr.replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
      return s1.replace(re, '$&,') + s2;
    });
    return result;
  }

  // 生成UUID
  guid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public handleGood = (response: any) => {
    if (response.code === 200) {
      this.message.create('success', '操作成功');
    }
    return response;
  };
  public handleBad = (response: any) => {
    if (response.code !== 200) {
      this.message.create('error', response.message);
    }
    return response;
  };
  /**
   * 去空格
   * @param str
   */
  trim(str: string) {
    if (str) {
      return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
    } else {
      return '';
    }
  }

  /**
   * 跳转页面
   * @param str
   */
  goToPage(pageName: string, pageUrl: string, params: any) {
    this.commonService.goInto({
      name: pageName,
      url: pageUrl,
      params: params || {}
    });
  }

  /**
   * 调用echarts-config 返回图表对象（返回对象自带TD标准图表样式，如需自定义其他，请在返回对象中修改）
   * @param chartType 图表类型  仅支持   lineBar: 线、柱图
   * Pie: 饼图   Funnel: 漏斗   Bubble: 散点  Radar : 雷达   Scatter : 散点   TreeMap : 矩形树图    Bubble : 堆积
   * @param data  主要是series chartType为lineBar时 多传xAxis值
   * @param direction lineBar是否需要翻转  true 需要  false 不需要
   */
  chartMergeReturnOption(chartType = 'lineBar', data: EChartOption, direction?: boolean) {
    let baseInfo = {
      chartType: chartType
    };
    // 线、柱图是否转换方向
    if (direction) {
      baseInfo['direction'] = 'transverse';
    }
    return chartMerge(baseInfo, data);
  }
  /**
   *  深拷贝
   * @param data
   */
  public deepCopy(data: any): any {
    let json = JSON.stringify(data);
    return JSON.parse(json);
  }
}
