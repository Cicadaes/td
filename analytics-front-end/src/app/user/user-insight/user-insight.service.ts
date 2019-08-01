import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { CurdService } from '../../curd.service';

@Injectable()
export class UserInsightService extends CurdService {
  _userInsight: any = {
    attribute: {},
    userInsight: [],
    userList: []
  };

  _userInsightParmas: any;
  _userListParmas: any;

  constructor(private injector: Injector) {
    super(injector);
  }

  // /crowd/user/filter 查询图标和table 人群洞察
  getPortrait(params: any) {
    return this.http.post('/crowd/user/carbon/filter', params).pipe(catchError(this.handleError));
  }

  // /crowd/crowds/query  // 查询人群名称是不是重复
  checkCrowdName(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get('/crowd/crowd/crowds/query/-1' + stringParams).pipe(catchError(this.handleError));
    // return this.http.post('/crowd/crowd/crowds/querye', params);
  }

  // /crowd/crowd/crowds  // 保存
  insertCrowdName(params: any) {
    // return this.http.get('/crowd/crowd/crowds/querye' + stringParams);
    return this.http.post('/crowd/crowd/crowds/realtime/create', params).pipe(catchError(this.handleError));
  }

  // /crowd/meta/metaAttribute/listDetails/{productId} 查询全量属性接口
  getAllArrtibute() {
    return this.http
      .get(`/crowd/meta/metaAttribute/listDetails/${this.getProductId()}`)
      .pipe(catchError(this.handleError));
  }

  // /crowd/user/queryProductConfig/{productId}/{source}/{type} 人群洞察 - 用户列表（查询表头列表）
  getThead() {
    return this.http
      .get(`/crowd/user/queryProductConfig/${this.getProductId()}/2/9`)
      .pipe(catchError(this.handleError));
  }

  // /crowd/user/queryUserProfile 人群洞察 - 用户列表（查询表格数据列表）
  getTableData(params: any) {
    params.productId = localStorage.getItem('productId');
    return this.http.post('/crowd/user/query/carbon/userProfile', params).pipe(catchError(this.handleError));
  }

  get userInsight() {
    return this._userInsight;
  }

  set userInsight(value: any) {
    this._userInsight = value;
  }

  get userInsightParmas() {
    return this._userInsightParmas;
  }

  set userInsightParmas(value: any) {
    this._userInsightParmas = value;
  }

  get userListParmas() {
    return this._userListParmas;
  }

  set userListParmas(value: any) {
    this._userListParmas = value;
  }
}
