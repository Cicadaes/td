import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FunnelAnalysisService extends CurdService {
  funnelId: number; // 漏斗id

  constructor(baseInjector: Injector) {
    super(baseInjector);
  }

  /**
   * 获取漏斗事件
   */
  getFunnelEvent() {
    let url = `/marketing-api/config/eventConfigs/all?funnelFlag=1&productId=${this.getProductId()}`;
    if (!this.funnelId) {
      url += '&status=0';
    }
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /**
   * 获取漏斗事件 （回显）
   */
  getFunnelEventEcho(funnelEventCodeList: any) {
    let url = `/marketing-api/config/eventConfigs/all/echo?funnelFlag=1&status=0&eventCode=${funnelEventCodeList}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  /**
   * 保存漏斗
   * @param data
   */
  saveFunnel(data: any) {
    return this.http.post(`/marketing-api/funnel/campaignFunnels/save`, data).pipe(catchError(this.handleError));
  }

  /**
   * 修改漏斗
   * @param data
   */
  updateFunnel(data: any) {
    return this.http.put(`/marketing-api/funnel/campaignFunnels/update`, data).pipe(catchError(this.handleError));
  }

  /**
   * 设置默认漏斗
   * @param id
   */
  setDefaultFunnel(id: number) {
    return this.http
      .put(`/marketing-api/funnel/campaignFunnels/setDefault/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * 获取漏斗详情
   * @param id
   */
  getFunnelDetail(id: number) {
    return this.http.get(`/marketing-api/funnel/campaignFunnels/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * 删除漏斗
   * @param id
   */
  deleteFunnel(id: number) {
    return this.http.delete(`/marketing-api/funnel/campaignFunnels/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * 获取漏斗列表
   * @param campaignId
   */
  getFunnelList(campaignId: number) {
    return this.http
      .get(`/marketing-api/funnel/campaignFunnels/all?campaignId=${campaignId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * 查询人群细分接口
   * @param campaignId
   */
  getGenerateCrowd(campaignId: number) {
    return this.http
      .get(`/marketing-api/crowd/crowds/generate?campaignId=${campaignId}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * 漏斗分析转化概览
   * @param param
   */
  getFunnelConvertOverview(param: any) {
    let buildParams = this.getParams(param);
    return this.http
      .get(`/marketing-api/funnel/campaignFunnels/funnelConvertOverview${buildParams}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * 获取转化概览图
   * @param param
   */
  getTrendChart(param: any) {
    let buildParams = this.getParams(param);
    return this.http
      .get(`/marketing-api/funnel/campaignFunnels/funnel/trend${buildParams}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * 获取终点事件累计完成趋势图
   * @param eventId
   * @param param
   */
  getLastEventChart(eventId: string, param: any) {
    let buildParams = this.getParams(param);
    return this.http
      .get(`/marketing-api/funnel/campaignFunnels/funnel/event/${eventId}/trend${buildParams}`)
      .pipe(catchError(this.handleError));
  }
}
