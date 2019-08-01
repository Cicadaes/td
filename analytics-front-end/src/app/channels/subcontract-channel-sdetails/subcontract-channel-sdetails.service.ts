import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
// import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class subcontractChannelsSdetailsService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  /**
   * 查询select数据
   * @param dataSourceId
   */
  public checkCrowdName(data: any) {
    let url = `${this.reportApiUrl}/config/dicts/dicItems`;
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
    let url = `${this.reportBaseUrl}/channelAnalysis/detail`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  /**
   * 渠道明细下载
   * @param dataSourceId
   */
  public customeChartsDitch(data: any) {
    let url = `${this.reportBaseUrl}/channelAnalysis/detail/download`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  /**
   * 渠道概览组件查询
   * @param dataSourceId
   */
  public surveyData(data: any) {
    let url = `${this.reportBaseUrl}/channelAnalysis/overview`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  /**
   * 留存率组件查询
   * @param dataSourceId
   */
  public etentionRendering(data: any) {
    let url = `${this.reportBaseUrl}/channelAnalysis/keep`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  /**
   * selectID查询
   * @param dataSourceId
   */
  public dicItem(data: any) {
    let url = `${this.reportBaseUrl}/dic/dicItem`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
  /**
   * 留存下载
   * @param dataSourceId
   */
  public download(data: any) {
    let url = `${this.reportBaseUrl}/channelAnalysis/keep/download`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
}
