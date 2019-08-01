import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class BrandSourceService { 
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  //GET /api/brandIndex/get-brandName   询当前用户正在使用的品牌名称
  getBrandList():Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/brandIndex/get-brandName')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/brandIndex/list 查询品牌下的关键字
  getBrandHotWord(params: any):Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/brandIndex/list', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/brandIndex/query-index 查询活动期，上期，同期指数数据
  getBrandIndex(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/brandIndex/query-index', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/brandIndex/insert 新增关键字
  insertHotWord(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/brandIndex/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  //GET  /api/delete/{id} 删除关键字
  deleteHotWord(key: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/brandIndex/delete/${key}`)
    .toPromise()
    .then(this.commonService.extractData)
    .catch(this.commonService.handleError)
  }
}
