import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from './utils/globals';
import { CommonService } from './common/services/common.service';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class CurdService {
  public static that: CurdService;
  public baseUrl: string;
  public reportBaseUrl: string;
  public reportApiUrl: string;
  public dataServiceBaseUrl: string;
  public miniprogramApiBaseUrl: string;
  public crowdApiBaseUrl: string;
  public productId: any;
  public urlParams: any;
  token: any;

  protected http: HttpClient;
  protected globals: Globals;
  protected commonService: CommonService;
  protected message: NzMessageService;

  constructor(private baseInjector: Injector) {
    this.http = this.baseInjector.get(HttpClient);
    this.globals = this.baseInjector.get(Globals);
    this.commonService = this.baseInjector.get(CommonService);
    this.message = this.baseInjector.get(NzMessageService);

    this.productId = this.getProductId();

    CurdService.that = this;
    this.reportBaseUrl = '/reportservice';
    this.dataServiceBaseUrl = '/dataservice';
    this.miniprogramApiBaseUrl = '/miniprogram-api';
    this.crowdApiBaseUrl = '/crowd';
    this.reportApiUrl = '/report-api';
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

  public getProductId() {
    return localStorage.getItem('productId');
  }

  /**
   * 错误处理
   * @param error
   */
  public handleError(error: any): Promise<any> {
    error = error.currentTarget;
    const errorCallback: any = {
      status: error.status,
      title: '错误',
      message: '错误'
    };
    return Promise.reject(errorCallback);
  }

  /**
   * 传参公共方法
   * @param params
   */
  //    encodeURIComponent(params[name])
  //    JSON.stringify(params[name])

  public getParams(params: any): string {
    const arr = [];
    for (const name in params) {
      if (params[name] != null) {
        arr.push(`${name}=${params[name]}`);
      }
    }
    return `?${arr.join('&')}`;
  }

  getIsVisitor() {
    const url = `${this.reportBaseUrl}/behaviorAnalysis/getIsVisitor`;
    return this.http.get(url);
  }

  /**
   * 获取app信息
   */
  public getPortalAppConfig() {
    const url = `/portal-api/portal/appConfig`;
    return this.http.get(url);
  }

  getSysParam() {
    const url = `${this.crowdApiBaseUrl}/admin/params/query`;
    return this.http.post(url, {
      data: [
        'analytics.custom.report.url',
        'my.report.url',
        'share.report.url',
        'user.group.report.url',
        'user.manage.report.url'
      ]
    });
  }

  redirect(): void {
    const url = `/portal-api/portal/cas`;
    this.http.get(url).subscribe((res: any) => {
      const redirect = res.securityUrl;
      const service = res.casServerLoginUrl;
      document.location.href = `${service}?service=${location.origin}${redirect}?spring-security-redirect=${
        document.location.href
      }`;
      localStorage.clear();
    });
  }
}
