import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class AuthSourceService { // 授权
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET  /api/auth/delete-auth-account/{authId} 删除活动
  deleteAuthAccount(authId: number): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/auth/delete-auth-account/${authId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/auth/add-auth-account 新增用户授权记录
  addAuthAccount(params: any): Observable<any> {
    return this.http.post(Config.BASE_API_URL + '/api/auth/add-auth-account', params)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // POST /api/auth/add-auth-account 更新用户授权记录
  updateAuthAccount(params: any): Observable<any> {
    return this.http.post(Config.BASE_API_URL + '/api/auth/add-auth-account', params)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/auth/list-auth-account/{id} 根据id获取指定授权记录
  getAuthAccoutListById(id: number): Observable<any> {
    return this.http.get(Config.BASE_API_URL + ` /api/auth/list-auth-account/${id}`)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/auth/list-auth-account 获取授权记录列表
  getAuthAccoutList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/auth/list-auth-account')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
