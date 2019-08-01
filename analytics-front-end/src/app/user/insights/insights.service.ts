import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class InsightsService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/crowd';
  }

  getCrowdById(crowdId: number) {
    const url = `${this.baseUrl}/crowd/crowds/${crowdId}`;
    return this.http.get(url);
  }

  getPortraitsGroup() {
    const url = `${this.baseUrl}/config/configCrowdPortraits?pager.pageEnabled=false`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /**
   * 获取数据字典
   */
  getParam(body: any) {
    const url = `${this.baseUrl}/admin/dic/query`;
    const json = {
      data: body
    };
    return this.http.post(url, json).pipe(catchError(this.handleError));
  }

  /**
   * 获取洞察用户列表表头
   * GET /user/queryProductConfig/{productId}/{source}/{type} 表头
   * source和type 暂时写死成2和9 不知道这两个字段从哪来
   */
  getTableListTitle() {
    const url = `${this.baseUrl}/user/queryProductConfig/${this.getProductId()}/2/9`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /**
   * 获取洞察用户列表数据
   * GET /user/queryProfileByOffset/{crowdId}/{page}/{rows}/{productId}
   */
  getTableList(crowdId: number, page: number, rows: number, productId: number) {
    const param = {
      crowdId: crowdId,
      page: page,
      productId: productId,
      rows: rows
    };
    const url = `${this.baseUrl}/user/query/carbon/userProfile/offset`;
    return this.http.post(url, param).pipe(catchError(this.handleError));
  }
}
