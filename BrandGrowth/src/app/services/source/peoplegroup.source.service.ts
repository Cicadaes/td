import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class PeoplegroupSourceService { // 受众接口
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }
 
  // GET  /api/labels/list  获取人群标签列表
  getPeoplegroupById(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/labels/list`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  } 

  // GET  /api/labels/delete/{id} 删除人群标签
  deletePeoplegroupLabel(crowdId: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/labels/delete/${crowdId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/labels/insert 新建人群
  creatPeoplegroup(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + `/api/labels/insert`, params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/labels/update 编辑人群
  updatePeoplegroup(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + `/api/labels/update`, params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}