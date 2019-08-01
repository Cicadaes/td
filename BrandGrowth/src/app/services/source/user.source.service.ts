import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class UserSourceService { // 用户
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/developer/get
  getUserData(): Observable<any> {
    return this.http.get(Config.BASE_API_URL + '/api/developer/get')
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

}
