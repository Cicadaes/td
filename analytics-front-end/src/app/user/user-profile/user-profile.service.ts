import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class UserProfileService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  req_listDetails() {
    const configUrl: any = `/crowd/meta/metaAttribute/listDetails/${this.getProductId()}`;
    return this.http.get(configUrl).pipe(catchError(this.handleError));
  }

  /**
   * 基本信息
   */
  req_profileDetail(params: any) {
    const configUrl: any = '/crowd/user/query/carbon/userProfile/profileDetail';
    return this.http.post(configUrl, params).pipe(catchError(this.handleError));
  }

  req_crowds(params: any) {
    let configUrl: any = '/crowd/user/crowds';
    const quertParams = this.getParams(params);
    configUrl = configUrl + quertParams;
    return this.http.get(configUrl).pipe(catchError(this.handleError));
  }

  /**
   * 所属标签
   */
  req_label(params: any) {
    let configUrl: any = `${this.crowdApiBaseUrl}/user/parts/tag`;
    const quertParams = this.getParams(params);
    configUrl = configUrl + quertParams;
    return this.http.get(configUrl).pipe(catchError(this.handleError));
  }

  /**
   * 指标分析
   */
  req_eventDate(params: any) {
    const configUrl: any = '/crowd/user/query/carbon/userProfile/eventDate';
    return this.http.post(configUrl, params).pipe(catchError(this.handleError));
  }

  /**
   * AEP-9463
   * @param dataSourceId
   */
  public req_eventList(params: any) {
    const quertParams = {
      productId: params.productId,
      offset: params.offset,
      startDate: params.startDate,
      endDate: params.endDate,
      accountOffset: params.accountOffset,
      page: params.page ? params.page : 1,
      rows: params.rows ? params.rows : 20,
      search: params.search ? params.search : ''
    };
    let url = `/crowd/user/query/carbon/userProfile/eventList`;
    return this.http.post(url, JSON.stringify(quertParams)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  req_eventPropertyList(event: any) {
    const configUrl: any = `/crowd/user/eventPropertyList/${this.getProductId()}/${event}`;
    return this.http.get(configUrl).pipe(catchError(this.handleError));
  }

  req_userEventReport(params: any) {
    const configUrl: any = '/crowd/user/query/carbon/userProfile/userEventReport';
    return this.http.post(configUrl, params).pipe(catchError(this.handleError));
  }

  req_eventHistory($param: any) {
    const date1 = $param.dateRange[0];
    const date2 = $param.dateRange[1];
    const configUrl = '/crowd/user/query/carbon/userProfile/eventHistory';
    const params = {
      accountOffset: $param.accountOffset || null,
      endDate: this.commonService.getDateStr(date2) || null,
      offset: $param.offset || null,
      page: $param.pageIndex || 1,
      productId: $param.productId,
      rows: $param.pageSize,
      startDate: this.commonService.getDateStr(date1) || null
    };
    return this.http.post(configUrl, params).pipe(catchError(this.handleError));
  }

  req_userProfileBehaviorDetails($params: any) {
    const configUrl = '/crowd/user/query/carbon/userProfile/userProfileBehaviorDetails';
    const params = {
      accountOffset: $params.accountOffset || null,
      endDate: this.globals.dateFormat($params.dateRange[1], '') || null,
      eventId: $params.eventId,
      offset: $params.offset || null,
      productId: this.getProductId(),
      startDate: this.globals.dateFormat($params.dateRange[0], '') || null,
      startTime: $params.startTime || null
    };
    return this.http.post(configUrl, params).pipe(catchError(this.handleError));
  }

  req_eventReport($param: any) {
    const date1 = $param.dateRange[0];
    const date2 = $param.dateRange[1];
    const url = '/crowd/user/query/carbon/userProfile/eventReport';
    const params = {
      accountOffset: $param.accountOffset || null,
      endDate: this.commonService.getDateStr(date2) || null,
      offset: $param.offset,
      productId: $param.productId,
      startDate: this.commonService.getDateStr(date1) || null
    };
    return this.http.post(url, params).pipe(catchError(this.handleError));
  }
}
