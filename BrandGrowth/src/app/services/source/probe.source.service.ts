import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class ProbeSourceService { // 用户
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/probe/list 探针组列表
  getProbeList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/probe/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

}
