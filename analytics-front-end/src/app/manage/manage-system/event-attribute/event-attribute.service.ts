import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { CurdService } from '../../../curd.service';

@Injectable()
export class EventAttributeService extends CurdService {
  queryGroupUrl: string;

  constructor(private injector: Injector) {
    super(injector);
    this.queryGroupUrl = this.reportBaseUrl + '/profileGroup/actionList';
  }

  queryGroup(params: any): Observable<{}> {
    return this.http.post(`${this.queryGroupUrl}`, params);
  }

  checkRepeat(params: any) {
    const url = this.reportBaseUrl + '/productProfilemetaAction/checkProductProfilemetaAction';
    return this.http.post(url, params);
  }

  add(params: any) {
    const url = this.reportBaseUrl + '/productProfilemetaAction/save';
    return this.http.post(url, params);
  }

  update(params: any) {
    const url = this.reportBaseUrl + '/productProfilemetaAction/update';
    return this.http.post(url, params);
  }

  query(params: any) {
    const url = this.reportBaseUrl + '/productProfilemetaAction/list';
    return this.http.post(url, params);
  }

  delete(params: any) {
    const url = this.reportBaseUrl + '/productProfilemetaAction/delete';
    return this.http.post(url, params);
  }
}
