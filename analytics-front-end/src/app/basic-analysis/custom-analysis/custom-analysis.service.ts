import { Injectable, Injector } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { CurdService } from '../../curd.service';

@Injectable()
export class CustomAnalysisService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
    this.baseUrl = '/reportservice/aeReport';
  }

  /**
   * 获取列表数据
   * @param body
   * page 页数
   * pageSize 每页条数
   */
  getList(param?: any) {
    let queryParams = '';
    if (param) {
      queryParams = this.getParams(param);
    }
    const url = `${this.baseUrl}/list${queryParams}`;
    return this.http.get(url);
  }

  /**
   * 保存报表
   * @param body 报表对象
   */
  saveReport(body: any) {
    const url = `${this.baseUrl}/save`;
    return this.http.post(url, body);
  }

  /**
   * 修改报表
   * @param body 报表对象
   */
  updateReport(body: any) {
    const url = `${this.baseUrl}/update`;
    return this.http.post(url, body);
  }

  /**
   * 删除报表
   * @param body 报表对象
   */
  deleteReport(body: any) {
    const url = `${this.baseUrl}/delete`;
    return this.http.post(url, body);
  }

  /**
   * 获取全部的用户信息
   * @param param
   */
  getAllUser(param?: any) {
    let queryParams = '';
    if (param) {
      queryParams = this.getParams(param);
    }
    const url = `/reportservice/aeReportShares/allUsers${queryParams}`;
    return this.http.get(url);
  }

  /**
   * 分享报表给用户
   * @param reportId 报表Id
   * @param userList 分享的用户
   */
  shareReportToUser(reportId: number, userList: any) {
    const url = `/reportservice/aeReportShares/batchUpdate/${reportId}`;
    return this.http.put(url, userList);
  }

  /**
   * 取消分享
   * @param reportId 报表Id
   */
  cancelReportToUser(reportId: number) {
    const url = `/reportservice/aeReportShares/cancelShare/${reportId}`;
    return this.http.post(url, {});
  }

  /**
   * 根据报表ID获取分享的用户列表
   * @param reportId
   */
  getShareListByReportId(reportId: number) {
    const url = `/reportservice/aeReportShares/list?reportId=${reportId}`;
    return this.http.get(url);
  }

  /**
   * 校验名称是否重复
   */
  checkName(body: any) {
    const url = `${this.baseUrl}/checkName`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }
}
