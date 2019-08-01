import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class AdcampSourceService { // 广告活动
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  //GET /api/activity/listBrandname   查询品牌对应接口
  getListBrandname():Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/activity/listBrandname')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET  /api/activity/delete/{key} 删除活动
  deleteActivity(key: string): Observable<any> {
    return this.http.get(Config.BASE_API_URL + `/api/activity/delete/${key}`)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/activity/insert 新增活动
  insertActivity(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/activity/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/activity/get/{key} 根据活动key获取指定活动
  getActivityByKey(key: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/activity/get/${key}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/activity/update 编辑活动
  updateActivity(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/activity/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/activity/list 获取广告活动列表
  getActivityList(): Promise<any>  {
    return this.http.get(Config.BASE_API_URL + '/api/activity/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/activity/list-with-addition 获取活动列表-有附加字段
  getActivityListWithAddition():Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/activity/list-with-addition')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST  /api/activity/list-all-in-one   活动列表查询接口-带指标查询
  getActivityListAll(parmas:any) : Promise<any>{
    return this.http.post(Config.BASE_API_URL + '/api/activity/list-all-in-one',parmas)
    .toPromise()
    .then(this.commonService.extractData)
    .catch(this.commonService.handleError)  
  }


}
