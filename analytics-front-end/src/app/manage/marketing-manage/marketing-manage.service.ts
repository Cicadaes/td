import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { CurdService } from '../../curd.service';

@Injectable()
export class MarketingManageService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  /* ================================= 维度配置 ==================================*/

  // /marketing-api/config/dimensionConfigs   查询人群维度列表
  getCrowdList(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get('/marketing-api/config/dimensionConfigs' + stringParams).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/dimensionConfigs/queryDimensionFromApi   查询可选维度列表
  getDimensionList(params: any) {
    const stringParams = this.getParams(params);
    return this.http
      .get('/marketing-api/config/dimensionConfigs/queryDimensionFromApi' + stringParams)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/config/dimensionOptionConfigs/queryOptionsFromApi   查询维度值列表
  getValueList(params: any) {
    const stringParams = this.getParams(params);
    return this.http
      .get('/marketing-api/config/dimensionOptionConfigs/queryOptionsFromApi' + stringParams)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/config/dimensionConfigs   新增维度
  insertDimension(params: any) {
    return this.http.post('/marketing-api/config/dimensionConfigs', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/dimensionConfigs   修改维度
  updateDimension(params: any) {
    return this.http.put('/marketing-api/config/dimensionConfigs', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/dimensionConfigs/{id}   删除维度
  deleteDimension(id: any) {
    return this.http.delete(`/marketing-api/config/dimensionConfigs/${id}`).pipe(catchError(this.handleError));
  }

  /* ================================= 指标相关配置 ==================================*/
  // /marketing-api/config/targetConfigs   获取指标相关列表
  getIndexList(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get('/marketing-api/config/targetConfigs' + stringParams).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/targetConfigs/queryTargetFromApi  获取可选指标列表
  getIndexValueList(params: any) {
    const stringParams = this.getParams(params);
    return this.http
      .get('/marketing-api/config/targetConfigs/queryTargetFromApi' + stringParams)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/config/targetConfigs  新建指标
  insertIndex(params: any) {
    return this.http.post('/marketing-api/config/targetConfigs', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/targetConfigs  更新指标
  updateIndex(params: any) {
    return this.http.put('/marketing-api/config/targetConfigs', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/targetConfigs/{id}  删除指标
  deleteIndex(id: any) {
    return this.http.delete(`/marketing-api/config/targetConfigs/${id}`).pipe(catchError(this.handleError));
  }

  /* ================================= 事件相关配置 ==================================*/
  // /marketing-api/config/eventConfigs   获取事件相关列表
  getEventList(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get('/marketing-api/config/eventConfigs' + stringParams).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/eventConfigs/queryEventFromApi  获取可选事件列表
  getEventValueList(params: any) {
    const stringParams = this.getParams(params);
    return this.http
      .get('/marketing-api/config/eventConfigs/queryEventFromApi' + stringParams)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/config/eventConfigs  新建事件
  insertEvent(params: any) {
    return this.http.post('/marketing-api/config/eventConfigs', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/eventConfigs  更新事件
  updateEvent(params: any) {
    return this.http.put('/marketing-api/config/eventConfigs', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/eventConfigs/{id}  删除事件
  deleteEvent(id: any) {
    return this.http.delete(`/marketing-api/config/eventConfigs/${id}`).pipe(catchError(this.handleError));
  }

  /* ================================= 归因模型配置 ==================================*/
  // /marketing-api/attribution/attributions  查询归因模型
  getAscribe(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get('/marketing-api/attribution/attributions' + stringParams).pipe(catchError(this.handleError));
  }

  // /marketing-api/attribution/attributions  新建归因模型
  insertAscribe(params: any) {
    return this.http.post('/marketing-api/attribution/attributions', params).pipe(catchError(this.handleError));
  }

  // /marketing-api/attribution/attributions  更新归因模型
  updateAscribe(params: any) {
    return this.http
      .put(`/marketing-api/attribution/attributions?productId=${this.getProductId()}`, params)
      .pipe(catchError(this.handleError));
  }
}
