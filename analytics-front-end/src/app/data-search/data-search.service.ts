import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../curd.service';

@Injectable()
export class DataSearchService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  generateApi(params: any) {
    const url = `${this.reportBaseUrl}/product/save`;
    return this.http.post(url, params);
  }
}
