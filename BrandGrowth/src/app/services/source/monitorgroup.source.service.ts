import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class MonitorgroupSourceService { // 监测链接组
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/monitor-link-group/delete/{id} 删除监测链接组
  deleteMonitorgroup(id: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/monitor-link-group/delete/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }   

  // POST  /api/monitor-link-group/insert  新建监测链接组
  insertMonitorgroup(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/monitor-link-group/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/monitor-link-group/update  更新监测链接组
  updateMonitorgroup(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/monitor-link-group/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET   /api/monitor-link-group/{id}  根据id获取指定监测链接组
  getMonitorgroupById(id: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/monitor-link-group/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  } 
  
  // GET /api/monitor-link-group/list/{key}   获取监测链接组列表
  getMonitorgroupListByKey(key: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/monitor-link-group/list/${key}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  } 

}