import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class CheatSourceService { // 作弊防护
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // POST /api/anti-cheating/update 新增或更新作弊防护配置参数
  deleteActivity(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/anti-cheating/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 更新作弊防护配置参数

  // GET /api/anti-cheating/list/{key} 获取作弊防护设置
  getAntiCheatingList(key: string): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/anti-cheating/list/${key}`)
      .toPromise() 
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
