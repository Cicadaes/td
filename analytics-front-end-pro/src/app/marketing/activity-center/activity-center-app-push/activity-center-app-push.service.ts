import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class ActivityCenterAppPushService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
        this.baseUrl = '/marketing-api';
    }

    /**
     * 获取自定义参数列表
     */
    getCustomParamList() {
        const url = `${this.baseUrl}/customParameter/customParameters`;
        return this.http.get(url);
    }

    /**
     * 获取app配置
     * @param appId
     */
    getAppConfig(appId: string) {
        const url = `${this.baseUrl}/config/appConfigs/appId/${appId}`;
        return this.http.get(url);
    }

}
