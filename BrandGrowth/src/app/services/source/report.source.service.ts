import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class ReportSourceService { // 用户
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // POST /api/marketReport/list 获取营销报告列表
  getMarketReportList(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/marketReport/list', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/marketReport/delete/{id} 删除选定营销报告
  deleteMarketReportById(id: any) {
    return this.http.get(Config.BASE_API_URL + `/api/marketReport/delete/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/marketReport/insert 新增
  insertMarketReport(params: any) {
    return this.http.post(Config.BASE_API_URL + `/api/marketReport/insert`, params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/marketReport/update 更新
  updateMarketReport(params: any) {
    return this.http.post(Config.BASE_API_URL + `/api/marketReport/update`, params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/marketReport/list-diy-chart 自定义报告类型左侧图标列表
  getMarketReportListDiyChart() {
    return this.http.get(Config.BASE_API_URL + `/api/marketReport/list-diy-chart`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
