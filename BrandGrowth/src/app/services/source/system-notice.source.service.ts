import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class SystemNoticeSourceService { // 用户
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // 获取所有公告信息列表
  getSystemNoticeList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/system-notice/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError);
  }

  // 获取未读信息数量
  getSystemNoticeListUnread(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/system-notice/list-unread')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError);
  }

  // 标记信息为已读
  getSystemMarkRead(noticeId: any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/system-notice/mark-read/${noticeId}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError);
  }
}
