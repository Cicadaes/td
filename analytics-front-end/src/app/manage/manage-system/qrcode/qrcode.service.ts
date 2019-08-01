import { catchError } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';

@Injectable()
export class QrcodeService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/miniprogram-api';
  }

  /**
   * 获取列表数据
   * @param body
   * page 页数
   * pageSize 每页条数
   */
  getList(body?: any) {
    if (!body) {
      body = {};
    }
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs/rows`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  /**
   * 获取appId和Secret
   */
  getAppId() {
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs/queryProduct/${this.getProductId()}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /**
   * 修改二维码状态
   */
  setStatus(body: any) {
    const url = `${this.baseUrl}/qrcode/updateQrcodeStatus`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  /**
   * 根据二维码名称查找二维码列表
   * @param name
   */
  searchQrcodeByName(name: any) {
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs/byName`;
    return this.http.post(url, { qrcodeName: name }).pipe(catchError(this.handleError));
  }

  /**
   * 新建二维码
   * @param body
   */
  createQrocde(body: any) {
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }
  /**
   * 批量创建二维码
   * @param body
   */
  batchCreateQrocde(body: any) {
    const url = `${this.baseUrl}/qrcode/batchQrcodeConfigs?productId=${this.getProductId()}`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  /**
   * 修改二维码名称
   * @param body
   * id 二维码id
   * qrcodeName 二维码名称
   */
  updateName(body: any) {
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs`;
    return this.http.put(url, body).pipe(catchError(this.handleError));
  }

  /**
   * 根据id获取详情
   * @param id
   */
  getQrcode(id: number) {
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /**
   * 下载模板
   * @param id
   */
  download() {
    const url = `${this.baseUrl}/qrcode/downloadTemplate`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  checkQrcodeName(name: string, productId: number) {
    const url = `${this.baseUrl}/qrcode/qrcodeConfigs/checkQrcodeName`;
    return this.http
      .post(url, {
        qrcodeName: name,
        productId: this.getProductId()
      })
      .pipe(catchError(this.handleError));
  }

  getParamList(params: any) {
    const url = `${this.reportBaseUrl}/poductParameterController/list`;
    return this.http.post(url, params);
  }
}
