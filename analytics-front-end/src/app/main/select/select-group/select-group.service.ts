import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';

@Injectable()
export class SelectGroupService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  getDatas(dataUrl: string, apiType: string, params: any) {
    if (apiType === 'post') {
      return this.http.post(dataUrl, params);
    } else if (apiType === 'get') {
      return this.http.get(dataUrl);
    }
  }
}
