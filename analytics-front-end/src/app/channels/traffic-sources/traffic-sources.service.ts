import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class trafficSourcesService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }
  /**
   * 预置参数状态查询
   * @param dataSourceId
   */
  public checkCrowdName(data: any) {
    // tslint:disable-next-line:max-line-length
    let url = `${this.reportBaseUrl}/poductParameterController/getUtmParam?productId=${localStorage.getItem(
      'productId'
    )}`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  /**
   * echarts组件查询H5来源分析
   * @param dataSourceId
   */
  public customeCharts(data: any) {
    let url = `${this.reportBaseUrl}/utmAnalysis/chartData`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // 下载
  download(body: any) {
    const url = `${this.reportBaseUrl}/utmAnalysis/tableData/download`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }

  /**
   * table组件查询
   * @param dataSourceId
   */
  public customeTable(data: any) {
    let url = `${this.reportBaseUrl}/utmAnalysis/tableData`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
}
