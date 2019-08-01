import { Injectable, Injector } from '@angular/core';
import { CurdService } from 'src/app/curd.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigManageService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  // 查看app配置
  getConfig(parmas: any) {
    return this.http.post(`${this.reportBaseUrl}/product/getProductById`, parmas).pipe(catchError(this.handleError));
  }

  // app配置保存接口
  updateConfig(parmas: any) {
    return this.http.post(`${this.reportBaseUrl}/product/update`, parmas).pipe(catchError(this.handleError));
  }
}
