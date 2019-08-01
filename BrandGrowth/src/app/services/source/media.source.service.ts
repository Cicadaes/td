import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { CommonService } from '../../config/Interceptor/common.service';
import { Config } from '../../config/Interceptor/config';
import { InterceptorService } from 'ng2-interceptors';
import { Observable } from 'rxjs';

@Injectable()
export class MediaSourceService { // 媒体
  constructor(
    private http: InterceptorService,
    private commonService: CommonService,
  ) { }

  // POST /api/channel/update-channel-switch 更新媒体回调开关
  updateChannelSwitch(params: any): Observable<any> {
    return this.http.post(Config.BASE_API_URL + '/api/channel/update-channel-switch', params)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET  /api/channel/get-channel-switch/{channelId} 获取媒体事件回调开关列表
  getChannelSwitch(channelId: number): Observable<any> {
    return this.http.get(Config.BASE_API_URL + `/api/channel/get-channel-switch/${channelId}`)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/channel/list 获取媒体列表
  getChannelList(): Promise<any> {
    return this.http.get(Config.BASE_API_URL + '/api/channel/list')
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/channel/get-channel-options/{channelId} 获取媒体参数
  getChannelOptions(channelId: number): Observable<any> {
    return this.http.get(Config.BASE_API_URL + `/api/channel/get-channel-options/${channelId}`)
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  // GET /api/channel/ping-url 调试回调配置
  getChannelPingUrl(url:any): Promise<any> {
    return this.http.get(Config.BASE_API_URL + `/api/channel/ping-url/?url=${url}`)
      .toPromise()
      .then(this.commonService.extractData)
      .catch(this.commonService.handleError)
  }

  
}
