import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class IndicatorsSourceService { // 指标查询
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }


  // GET /api/metric-data/query
  queryMetricData(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/metric-data/query', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
