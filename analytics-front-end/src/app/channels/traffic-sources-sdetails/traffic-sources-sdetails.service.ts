import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class trafficSourcesSdetailsService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }
  /**
   * 预置参数状态查询
   * @param dataSourceId
   */
  public checktable(data: any) {
    // tslint:disable-next-line:max-line-length
    let url = `${this.reportBaseUrl}/poductParameterController/getUsedParam?productId=${localStorage.getItem(
      'productId'
    )}`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  /**
   * 查询select数据
   * @param dataSourceId
   */
  public checkCrowdName(data: any) {
    let url = `${this.reportBaseUrl}/utmAnalysis/originalData`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  /**
   * echarts+table组件查询
   * @param dataSourceId
   */
  public customeCharts(data: any) {
    let url = `${this.reportBaseUrl}/utmAnalysis/detail`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  /**
   *数据概览组件查询
   * @param dataSourceId
   */
  public surveyData(data: any) {
    let url = `${this.reportBaseUrl}/utmAnalysis/overview`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  // 下载
  download(body: any) {
    const url = `${this.reportBaseUrl}/utmAnalysis/detail/download`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }
}
