import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class subcontractChannelsService extends CurdService {
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
   * echarts组件查询
   * @param dataSourceId
   */
  public customeCharts(data: any) {
    let url = `${this.reportBaseUrl}/channelAnalysis/chartData`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  // table组件下载
  download(data: any) {
    const url = `${this.reportBaseUrl}/channelAnalysis/tableData/download`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }

  /**
   * table组件查询
   * @param dataSourceId
   */
  public customeTable(data: any) {
    let url = `${this.reportBaseUrl}/channelAnalysis/tableData`;
    return this.http.post(url, JSON.stringify(data)).pipe(
      tap(response => response),
      catchError(this.handleError)
    );
  }
}
