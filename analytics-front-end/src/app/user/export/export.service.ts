import { catchError } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';

@Injectable()
export class ExportService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/crowd';
  }

  // 根据id 获取人群信息
  getCrowdById(crowdId: number) {
    const url = `${this.baseUrl}/crowd/crowds/${crowdId}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  // 获取信息属性组查询接口
  getListDetails() {
    const url = `${this.baseUrl}/meta/metaAttribute/listDetails/${this.getProductId()}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  // 用户配置通用配置查询接口
  getProductConfig(source: number, type: number) {
    //        const url = `${this.baseUrl}/user/queryProductConfig/${this.getProductId()}/${source}/${type}`;
  }

  exportCrowd(crowdId: number, attribute: any) {
    const url = `${this.baseUrl}/crowd/crowd/export/${crowdId}?crowdId=${crowdId}`;
    return this.http
      .put(url, attribute)
      .pipe(catchError(this.handleError))
      .pipe(catchError(this.handleError));
  }

  getListDetailsForId() {
    const url = `${this.baseUrl}/config/metaAttributeGroup/listDetails?source=1&type=5&pager.pageEnabled=false`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
}
