import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../../curd.service';

@Injectable()
export class CapacityPathFunnelAddService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  add(params: any) {
    const url = this.reportBaseUrl + '/conversionFunnel/save';
    return this.http.post(url, params);
  }

  queryEventType(params: any) {
    const url = this.reportBaseUrl + '/smartPath/queryEventType';
    return this.http.post(url, params);
  }
}
