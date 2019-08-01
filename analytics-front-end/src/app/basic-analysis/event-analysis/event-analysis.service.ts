import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { CurdService } from '../../curd.service';

@Injectable()
export class EventAnalysisService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/reportservice';
  }

  getEvents(params: any) {
    const url = `${this.baseUrl}/eventAnalysis/overview`;
    return this.http.post(url, params);
  }

  getTags(params: any) {
    const url = `${this.baseUrl}/eventContrastAnalysis/labelData`;
    return this.http.post(url, params);
  }

  getEventAttrs(params: any) {
    const url = `${this.baseUrl}/eventContrastAnalysis/attrData`;
    return this.http.post(url, params);
  }

  getEventList(params: any) {
    let url = `${this.baseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}`;
    const quertParams = this.getParams(params);
    url = url + quertParams;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getProvince() {
    const params = {
      displayType: 'Tag',
      showAll: true,
      shieldEvent: true,
      shieldPage: true,
      sort: 'dic_item_alias',
      order: 'asc',
      productId: this.getProductId()
    };
    const url = `${this.reportBaseUrl}/behaviorAnalysis/profilemetas`;
    return this.http.post(url, params);
  }

  getProfilemetasList(eventId: number) {
    const url = `${this.baseUrl}/behaviorAnalysis/profilemetas/${this.getProductId()}?eventId=${eventId}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  // 占时不使用
  getProfilemetasEventList() {
    const url = `${this.baseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}?dicKey=eventid`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  search(body: any) {
    const url = `${this.baseUrl}/eventContrastAnalysis/chartData`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  exportEventList(param: any) {
    const url = `${this.baseUrl}/eventAnalysis/overview/download/event`;
    return this.http.post(url, param).pipe(catchError(this.handleError));
  }
  export(param: any) {
    const url = `${this.baseUrl}/exportJob/export`;
    return this.http.post(url, param).pipe(catchError(this.handleError));
  }

  queryDictItems(dictName: any, searchValue: any) {
    const configUrl: any = this.crowdApiBaseUrl + '/admin/dicItems/query';
    return this.http.post(configUrl, {
      dicItemAliasOrValue: searchValue,
      dicItemKey: dictName,
      productId: this.getProductId()
    });
  }
}
