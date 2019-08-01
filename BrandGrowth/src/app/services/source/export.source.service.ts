import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class ExportSourceService { // 广告活动
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  //GET /api/export/list   获取导出任务列表
  getExportList(params: any):Promise<any> {
    //let stringParams = this.commonService.getParams(params);
    return this.http.get(Config.BASE_API_URL + '/api/export/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  //GET  /api/export/delete/{key} 删除活动
  deleteExport(key: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/export/delete/${key}`)
    .toPromise()
    .then(this.commonService.extractData)
    .catch(this.commonService.handleError)
  }

  // POST /api/export/insert 新增活动
  insertExport(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/export/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/export/changeRetry/{key} 重试导出任务
  againExport(key: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/export/changeRetry/${key}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/export/list-monitor-link 获取有数据的媒体和监测链接列表
  getListMonitorLink(params: any):Promise<any> {
    //let stringParams = this.commonService.getParams(params);
    return this.http.get(Config.BASE_API_URL + `/api/export/list-monitor-link/?activityKey=${params.activityKey}&eventId=${params.eventId}&start=${params.start}&end=${params.end}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
