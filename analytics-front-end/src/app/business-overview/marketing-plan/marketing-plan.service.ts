import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';

@Injectable()
export class MarketingPlanService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/marketing-api/campaign';
  }

  /**
   * 获取营销活动当前年的计划完成情况
   */
  getCurrYearOverview() {
    const url = `${this.baseUrl}/campaign/year/stat`;
    return this.http.get(url);
  }

  /**
   * 获取活跃用户总量
   * @param param
   */
  queryActiveUsers(param: any) {
    let queryParams = '';
    if (param) {
      queryParams = this.getParams(param);
    }
    const url = `${this.baseUrl}/statActiveUsers${queryParams}`;
    return this.http.post(url, {});
  }

  /**
   * 获取营销活动计划表
   * @param param
   */
  queryCampaignList(param: any) {
    let queryParams = '';
    if (param) {
      queryParams = this.getParams(param);
    }
    const url = `${this.baseUrl}/campaigns/byDate${queryParams}`;
    return this.http.get(url);
  }
}
