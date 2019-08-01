import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../curd.service';

@Injectable()
export class ProductCenterService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  checkWeChatAppInfo(param: any) {
    const miniprogramAppid = param.miniprogramAppid;
    const miniprogramSecret = param.miniprogramSecret;
    const url = `${
      this.miniprogramApiBaseUrl
    }/qrcode/qrcodeConfigs/checkWeChatAppInfo/${miniprogramAppid}/${miniprogramSecret}`;
    return this.http.get(url);
  }

  getAppConfig() {
    const url = `${this.reportBaseUrl}/index`;
    return this.http.get(url);
  }

  checkProduct(params: any) {
    const url = `${this.reportBaseUrl}/product/checkProduct`;
    return this.http.post(url, params);
  }

  addProducts(params: any) {
    const url = `${this.reportBaseUrl}/product/save`;
    return this.http.post(url, params);
  }

  updateProducts(params: any) {
    const url = `${this.reportBaseUrl}/product/updateProductName`;
    return this.http.post(url, params);
  }

  getProducts(params: any) {
    const url = `${this.reportBaseUrl}/product/list`;
    return this.http.post(url, params);
  }

  deleteProduct(params: any) {
    const url = `${this.reportBaseUrl}/product/delete`;
    return this.http.post(url, params);
  }
  /**
   * 获取全部的角色信息
   * @param param
   */
  getAllRoles(param?: any) {
    let queryParams = '';
    if (param) {
      queryParams = this.getParams(param);
    }
    const url = `${this.reportBaseUrl}/product/allRoles${queryParams}`;
    return this.http.get(url);
  }

  /**
   * 获取全部的用户信息
   * @param param
   */
  getAllUser(param?: any) {
    let queryParams = '';
    if (param) {
      queryParams = this.getParams(param);
    }
    const url = `${this.reportBaseUrl}/product/allUsers${queryParams}`;
    return this.http.get(url);
  }

  shareProduct(productId: any, params: any) {
    const url = `${this.reportBaseUrl}/productShare/batchInsert/${productId}`;
    return this.http.post(url, params);
  }

  queryProductShareList(params: any) {
    const url = `${this.reportBaseUrl}/productShare/list`;
    return this.http.post(url, params);
  }
}
