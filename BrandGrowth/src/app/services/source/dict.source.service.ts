import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class DictSourceService { // 字典数据
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/dict/callback-event/list 获取回调事件列表
  getCallbackEventList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/dict/callback-event/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
  
  // POST /api/dict/callback-params/list 获取回调事件参数列表
  getCallbackParamsList(eventId: number, platformId:number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/dict/callback-params/list/?eventId=${eventId}&platformId=${platformId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/dict/ad-type/list 获取广告类型列表
  getAdTypeList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/dict/ad-type/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/dict/industry/list 获取行业列表
  getIndustryList() :Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/dict/industry/list')
       .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/dict/region/list 获取行政区域列表
  getRegionList() :Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/dict/region/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
