import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';

@Injectable()
export class UserAttributeService extends CurdService {
  queryGroupUrl: string;

  constructor(private injector: Injector) {
    super(injector);
    this.queryGroupUrl = this.reportBaseUrl + '/profileGroup/list';
  }

  queryGroup(params: any) {
    return this.http.post(this.queryGroupUrl, params);
  }

  checkRepeat(params: any) {
    const url = this.reportBaseUrl + '/productProfilemeta/checkProductProfilemeta';
    return this.http.post(url, params);
  }

  add(params: any) {
    const url = this.reportBaseUrl + '/productProfilemeta/save';
    return this.http.post(url, params);
  }

  update(params: any) {
    const url = this.reportBaseUrl + '/productProfilemeta/update';
    return this.http.post(url, params);
  }

  query(params: any) {
    const url = this.reportBaseUrl + '/productProfilemeta/list';
    return this.http.post(url, params);
  }

  delete(params: any) {
    const url = this.reportBaseUrl + '/productProfilemeta/delete';
    return this.http.post(url, params);
  }
}
