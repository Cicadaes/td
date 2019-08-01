import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class ConsumerPortraitSourceService { // 客群画像
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // 客群画像分页列表
  getConsumerPortraitList(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/consumerPortrait/list', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 客群画像全部列表 /api/consumerPortrait/list-all
  getConsumerAllList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/consumerPortrait/list-all')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 获取某条画像数据
  getConsumerPortraitById(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/consumerPortrait/get/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 创建画像
  insertConsumerPortrait(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/consumerPortrait/insert', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 更新画像
  updateConsumerPortrait(params: any): Promise<any> {
    return this.http.post(Config.BASE_API_URL + '/api/consumerPortrait/update', params)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 获取某条画像的基本属性
  getConsumerBaseDetails(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/consumerPortrait/get-basic-attribute/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
  
  // 获取某条画像的电商团购
  getConsumerBusinessDetails(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/consumerPortrait/getelectronicBusiness/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
}
