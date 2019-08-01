import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';

@Injectable()
export class ChinaMapChartService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  getDatas(url: string, param: any) {
    const apiUrl = url + this.getParams(param);
    return this.http.get(apiUrl);
  }
}
