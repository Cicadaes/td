import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class EffectSourceService { // 营销效果
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/appFlow/list/{activityKey} 查询指定活动key的所有app
  getAppFlowList(activityKey: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/appFlow/list/${activityKey}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/appFlow/listApp 查询当前用户可以监控的app
  getAppFlowListApp(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/appFlow/listApp')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/appFlow/query-app-data 查询app激活量和活跃量接口
  queryAppData(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/appFlow/query-app-data', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/appFlow/insert 新增app流量
  insertAppFlow(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/appFlow/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/appFlow/delete/{id} 删除app
  deleteAppFlowById(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/appFlow/delete/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
