import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AdvancedTransFunnelService extends CurdService {
  queryEventUrl: string;
  queryEventPostUrl: string;

  constructor(private injector: Injector) {
    super(injector);
    this.queryEventUrl = `${
      this.reportBaseUrl
    }/behaviorAnalysis/dictionarys/${this.getProductId()}?sort=dic_item_alias&order=asc&dicKey=`;

    this.queryEventPostUrl = `${this.reportBaseUrl}/behaviorAnalysis/queryDictionaryList`;
  }

  queryEventAttrs(params: any) {
    const url = `${this.reportBaseUrl}/behaviorAnalysis/queryEventProperties`;
    return this.http.post(url, params);
  }

  queryChildEvents(params: any) {
    //  const str = this.getDataParams('', params);
    const url = `${this.reportBaseUrl}/behaviorAnalysis/queryDictionaryList`;
    return this.http.post(url, params);
  }

  queryEventTypes() {
    const url = `${this.reportBaseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}?dicKey=eventtype&order=asc`;
    return this.http.get(url);
  }

  add(params: any) {
    const url = `${this.reportBaseUrl}/conversionFunnel/save`;
    return this.http.post(url, params);
  }

  getById(id: any) {
    const url = `${this.reportBaseUrl}/conversionFunnel/get/${id}`;
    return this.http.get(url);
  }

  update(params: any) {
    const url = `${this.reportBaseUrl}/conversionFunnel/update`;
    return this.http.post(url, params);
  }

  query(params: any) {
    const url = `${this.reportBaseUrl}/conversionFunnel/list`;

    return this.http.post(url, params);
  }

  delete(params: any) {
    const url = `${this.reportBaseUrl}/conversionFunnel/delete/${params.id}`;
    return this.http.delete(url);
  }

  // 传参公共方法
  getDataParams(url: string, params: any): string {
    const arr = [];
    for (const name in params) {
      if (true) {
        arr.push(`${name}=${params[name]}`);
      }
    }
    if (url.indexOf('?') !== -1) {
      return arr.join('&');
    } else {
      return '?' + arr.join('&');
    }
  }

  /*查看漏斗详情start*/
  getEventList(params: any) {
    let url = `${this.reportBaseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}`;
    const quertParams = this.getParams(params);
    url = url + quertParams;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getProvince() {
    const param = `displayType=Tag&showAll=true&shieldEvent=true&sort=dic_item_alias&order=asc`;
    const url = `${this.reportBaseUrl}/behaviorAnalysis/profilemetas/${this.getProductId()}?${param}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getProfilemetasList(eventId: number) {
    const url = `${
      this.reportBaseUrl
    }/behaviorAnalysis/profilemetas/${this.getProductId()}?eventId=${eventId}&shieldEvent=true&showCrowd=true`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  // 占时不使用
  getProfilemetasEventList() {
    const url = `${this.reportBaseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}?dicKey=eventid`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  search(body: any) {
    const url = `${this.reportBaseUrl}/conversionFunnel/queryData`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  download(body: any) {
    const url = `${this.reportBaseUrl}/exportJob/export`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  /*查看漏斗详情end*/

  /*用户信息start*/
  queryUsers(params: any, pageSource: any) {
    let url = '';
    if (pageSource === 'behavior-analysis') {
      url = `${this.reportBaseUrl}/eventContrastAnalysis/queryCrowdData`; // 事件分析用户列表
    } else if (pageSource === 'advanced-trans-funnel') {
      url = `${this.reportBaseUrl}/conversionFunnel/queryCrowdData`; // 高级转化漏斗用户列表
    }
    return this.http.post(url, params);
  }

  queryTableColumns() {
    const params = {
      shieldEvent: true,
      shieldPage: true,
      productId: this.getProductId()
    };
    const url = `${this.reportBaseUrl}/behaviorAnalysis/profilemetas`;
    return this.http.post(url, params);
  }

  saveCrowd(params: any, pageSource: any) {
    let url = '';
    if (pageSource === 'behavior-analysis') {
      url = `${this.reportBaseUrl}/eventContrastAnalysis/saveCrowdGroup`; // 事件分析保存人群
    } else if (pageSource === 'advanced-trans-funnel') {
      url = `${this.reportBaseUrl}/conversionFunnel/saveCrowd`; // 高级转化漏斗
    }
    return this.http.post(url, params);
  }

  exportCrowd(params: any) {
    const url = `${this.reportBaseUrl}/exportJob/export`;
    return this.http.post(url, params);
  }

  /*用户信息end*/

  /**
   * 查询产品的sourceids
   */
  getTabList(productId: any) {
    const params = { productId: productId };
    const url = `${this.reportBaseUrl}/funnelReport/getDictionaryItemList?productId=${this.getProductId()}`;
    return this.http.post(url, params);
  }

  /**
   * 查询SdkId
   */
  getSdkId(params: any) {
    const url = `${this.reportBaseUrl}/funnelReport/getDictionaryItem?productId=${params.productId}`;
    return this.http.post(url, params);
  }
}
