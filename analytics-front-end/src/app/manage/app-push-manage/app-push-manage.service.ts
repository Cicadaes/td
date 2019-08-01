import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppPushManageService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

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
}
