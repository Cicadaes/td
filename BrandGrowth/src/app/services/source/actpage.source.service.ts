import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class ActpageSourceService { // 用户
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/act-page/list 获取活动页列表
  getActpageList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/act-page/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET   /api/act-page/get/{id}  获取指定Id活动页
  getActpageGetById(id: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/act-page/get/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST   /api/act-page/update  更新活动页
  updateActpage(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/act-page/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST  /api/act-page/insert  新建活动页
  insertActpage(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/act-page/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET  /api/act-page/delete/{id}  删除活动页
  deleteActpage(id: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/act-page/delete/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
  // GET  获取活动页key   /api/act-page/gen-key
      
  getAppIDKey(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/act-page/gen-key')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
  
}
