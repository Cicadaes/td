import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class MonitorSourceService { // 监测链接
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/monitor-link/delete/{key}/{monitorLinkId} 删除监测链接
  deleteMonitorLink(key: string, monitorLinkId: (number | string)): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/monitor-link/delete/${key}/${monitorLinkId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/monitor-link/cancel-import 取消标记重点监测
  cancleImportMonitorLink(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/monitor-link/cancel-import', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/monitor-link/insert 新增监测链接
  insertMonitorLink(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/monitor-link/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/monitor-link/mark-import 标记重点监测
  markImportMonitorLink(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/monitor-link/mark-import', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/monitor-link/get/{key}/{linkId} 根据id获取指定监测链接
  getMonitorLinkById(key: string, linkId: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/monitor-link/get/${key}/${linkId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/monitor-link/update 编辑监测链接
  updateMonitorLink(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/monitor-link/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/monitor-link/generate-short-url/{key} 获取6位监测短链
  getMonitorLinkGenerateShortUrl(key: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/monitor-link/generate-short-url/${key}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/consumerPortrait/getMonitorLink 获取所有的监测链接列表数据
  getAllMonitorLink(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/consumerPortrait/getMonitorLink')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
