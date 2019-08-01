import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApplyManageService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  /*========================================== 应用推送配置 =========================================*/
  // /marketing-api/config/appConfigs/{productId}  选择app查询相关配置结果
  getAppConfig() {
    return this.http.get(`/marketing-api/config/appConfigs/${this.getProductId()}`).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/appConfigs/thirdchannel/config  更新andriod推送配置
  updateAndroidPush(params: any) {
    return this.http
      .patch('/marketing-api/config/appConfigs/thirdchannel/config', params)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/config/appConfigs/pem/upload/{appId}/{productId}  IOS上传证书
  updateIOS(params: any, appId: any, proId: any) {
    return this.http
      .post(`/marketing-api/config/appConfigs/pem/upload/${appId}/${proId}`, params)
      .pipe(catchError(this.handleError));
  }

  // /marketing-api/config/appConfigs/{appId}/{channel}  个推和极光的清空接口
  deleteAndroidPush(appId: any, channel: any) {
    return this.http
      .patch(`/marketing-api/config/appConfigs/${appId}/${channel}`, {})
      .pipe(catchError(this.handleError));
  }

  /*========================================== 短信邮件配置 =========================================*/
  // /marketing-api/config/channelConfigs    // 获取通道列表
  getChannelConfig(params: any) {
    const stringParams = this.getParams(params);
    return this.http.get(`/marketing-api/config/channelConfigs` + stringParams).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/channelConfigs    // 新建通道配置
  insertChannelConfig(params: any) {
    return this.http.post(`/marketing-api/config/channelConfigs`, params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/channelConfigs    // 更新通道列表
  updateChannelConfig(params: any) {
    return this.http.put(`/marketing-api/config/channelConfigs`, params).pipe(catchError(this.handleError));
  }

  // /marketing-api/config/channelConfigs    // 删除通道列表
  deleteChannelConfig(id: any) {
    return this.http.delete(`/marketing-api/config/channelConfigs/${id}`).pipe(catchError(this.handleError));
  }
}
