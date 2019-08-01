import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ReportService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  // marketing-api/report/pushReports/contribute/{campaignId}/{segmentId}  获取贡献率
  getContribute(segmentId: any, campaignId: any) {
    return this.http
      .get(`/marketing-api/report/pushReports/contribute/${campaignId}/${segmentId}`)
      .pipe(catchError(this.handleError));
  }

  // marketing-api/campaign/campaignTargets/campaignId/{campaignId}  计划目标列表
  getCampaign(campaignId: any) {
    return this.http
      .get(`/marketing-api/campaign/campaignTargets/campaignId/${campaignId}`)
      .pipe(catchError(this.handleError));
  }

  /** ====================================  push投放报告接口  =========================================== */
  // /marketing-api/report/pushReports/overview/{segmentId}  查询投放概览数据
  getOverview(segmentId: any, date: any) {
    return this.http.get(`/marketing-api/report/pushReports/overview/${segmentId}`).pipe(catchError(this.handleError));
  }

  // marketing-api/report/pushReports/timeaxis/{segmentId}  查询投放时间轴
  getTimeAxis(segmentId: any) {
    return this.http.get(`/marketing-api/report/pushReports/timeaxis/${segmentId}`).pipe(catchError(this.handleError));
  }

  // marketing-api/report/pushReports/trend/{segmentId}  趋势分析
  getTrend(segmentId: any) {
    return this.http.get(`/marketing-api/report/pushReports/trend/${segmentId}`).pipe(catchError(this.handleError));
  }

  // /marketing-api/report/pushReports/downloadOverviewReport/{productId}/{segmentId}  投放概览下载
  downLoadOver(productId: any, segmentId: any) {
    return this.http
      .get(`/marketing-api/report/pushReports/downloadOverviewReport/${segmentId}`)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/report/pushReports/downloadTrendReport/{productId}/{segmentId}  趋势分析下载
  downLoadTrend(productId: any, segmentId: any) {
    return this.http
      .get(`/marketing-api/report/pushReports/downloadTrendReport/${segmentId}`)
      .pipe(catchError(this.handleError));
  }

  /** ====================================  邮件投放报告接口  =========================================== */
  // marketing-api/report/edmReports/overview/{segmentId}  查询投放概览数据
  getEdmOverview(segmentId: any) {
    return this.http.get(`/marketing-api/report/edmReports/overview/${segmentId}`).pipe(catchError(this.handleError));
  }

  // marketing-api/report/edmReports/trend/{segmentId}  查询趋势分析数据
  getEdmTrend(segmentId: any, statDimension: any) {
    return this.http
      .get(`/marketing-api/report/edmReports/trend/${segmentId}?statDimension=${statDimension}`)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/report/edmReports/downloadOverviewReport/{segmentId}  投放概览下载
  downLoadEdmOver(segmentId: any) {
    return this.http
      .get(`/marketing-api/report/edmReports/downloadOverviewReport/${segmentId}`)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/report/edmReports/downloadTrendReport/{segmentId}  趋势分析下载
  downLoadEdmTrend(segmentId: any, statDimension: any) {
    const url = `/marketing-api/report/edmReports/downloadTrendReport/${segmentId}?statDimension=${statDimension}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /** ====================================  短信投放报告接口  =========================================== */
  // marketing-api/report/smsReports/overview/{segmentId}  查询投放概览数据
  getSmsOverview(segmentId: any) {
    return this.http.get(`/marketing-api/report/smsReports/overview/${segmentId}`).pipe(catchError(this.handleError));
  }

  // marketing-api/report/smsReports/trend/{segmentId}  查询趋势分析数据
  getSmsTrend(segmentId: any, statDimension: any) {
    return this.http
      .get(`/marketing-api/report/smsReports/trend/${segmentId}?statDimension=${statDimension}`)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/report/smsReports/downloadOverviewReport/{segmentId}  投放概览下载
  downLoadSmsOver(segmentId: any) {
    return this.http
      .get(`/marketing-api/report/smsReports/downloadOverviewReport/${segmentId}`)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/report/smsReports/downloadTrendReport/{segmentId}  趋势分析下载
  downLoadSmsTrend(segmentId: any, statDimension: any) {
    const url = `/marketing-api/report/smsReports/downloadTrendReport/${segmentId}?statDimension=${statDimension}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
}
