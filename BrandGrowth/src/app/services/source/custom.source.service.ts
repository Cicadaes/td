import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class CustomSourceService { // 用户自定义回调
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET  /api/custom-callback/delete/{id} 删除自定义回调配置
  deleteActivity(id: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/custom-callback/delete/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST  /api/custom-callback/insert 新增自定义回调
  insertCustomCallback(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/custom-callback/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/custom-callback/update-switch 更新回调配置开关
  updateCustomCallbackSwitch(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/custom-callback/update-switch', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/custom-callback/update 更新用户自定义回调
  updateCustomCallback(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/custom-callback/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/custom-callback/get/{id} 根据id获取指定回调配置
  getCustomCallbackById(id: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/custom-callback/get/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/custom-callback/list 获取回调配置列表
  getCustomCallbackList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/custom-callback/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
