import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

/**
 * 处理formData
 * @param {any} params
 * @returns [formData]
 */
const SetFormData = (params: any) => {
  const form = new FormData();
  Object.keys(params).forEach((key) => {
    form.append(key, params[key]);
  });
  return form;
};

@Injectable()
export class BtlSourceService { // 用户
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // GET /api/btl/list 线下区域列表
  getBtlList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/btl/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 获取指定的线下区域
  getBtlById(id: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/btl/${id}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // 删除指定线下区域
  onDeleteBtl(btlId: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/btl/delete/${btlId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }
  // 获取探针模板文件
  getTemplate(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/btl/download-file`)
    .toPromise()
    .then(this.commonService.extractData)
    .catch(this.commonService.handleError)
  }
  // 新增线下区域
  addBtl(params: any): Promise<any> {
    const header = new Headers();
    header.append('Content-Type', 'multipart/form-data');
    const headers = {headers: header};
    const data = SetFormData(params);
    return this.http.post(Config.BASE_API_URL + '/api/btl/add', data, headers)
    .toPromise()
    .then(this.commonService.extractData)
    .catch(this.commonService.handleError)
  }

  // 更新线下区域
  updateBtl(params: any): Promise<any> {
    const header = new Headers();
    header.append('Content-Type', 'multipart/form-data');
    const headers = {headers: header};
    const data = SetFormData(params);
    return this.http.post(Config.BASE_API_URL + '/api/btl/update', data, headers)
    .toPromise()
    .then(this.commonService.extractData)
    .catch(this.commonService.handleError)
  }
}
