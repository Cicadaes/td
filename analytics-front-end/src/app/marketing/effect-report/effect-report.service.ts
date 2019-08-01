import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EffectReportService extends CurdService {
  private queryUrl: string;

  constructor(private injector: Injector) {
    super(injector);
    this.queryUrl = '/marketing-api/report/reportRels';
  }

  /**
   * 获取活动详情
   * @param data
   */
  getCampaignInfo(campaignId: number) {
    return this.http.get(`/marketing-api/campaign/campaigns/${campaignId}`).pipe(catchError(this.handleError));
  }

  /**
   * 获取设置的报表类别
   * @param data
   */
  getSavedReport(campaignId: number) {
    return this.http.get(`${this.queryUrl}?campaignId=${campaignId}`).pipe(catchError(this.handleError));
  }

  /**
   * 获取自定义报表列表
   */
  getTemplates(data: any) {
    const param = this.getParams(data);
    return this.http.get(`${this.queryUrl}/queryFormsFromApi${param}`).pipe(catchError(this.handleError));
  }

  /**
   * 保存选中的报表
   */
  saveSelectReport(data: any) {
    return this.http.post(`${this.queryUrl}`, data).pipe(catchError(this.handleError));
  }

  /**
   * 删除配置过的报表
   */
  deleteSavedReport(id: number) {
    return this.http.delete(`${this.queryUrl}/${id}`).pipe(catchError(this.handleError));
  }
}
