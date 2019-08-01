import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';

@Injectable()
export class AppInfoService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  getAppConfig() {
    const url = this.reportBaseUrl + '/index';
    return this.http.get(url);
  }

  getAppInfo(params: any) {
    const url = this.reportBaseUrl + '/product/getProductById';
    return this.http.post(url, params);
  }

  changeIsCollectData(params: any) {
    const url = this.reportBaseUrl + '/product/update';
    return this.http.post(url, params);
  }
}
