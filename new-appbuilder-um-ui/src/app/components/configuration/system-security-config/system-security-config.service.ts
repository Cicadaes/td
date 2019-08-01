import { Injectable } from '@angular/core';
import { CRUDService } from '../../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class SystemSecurityConfigService extends CRUDService {

    constructor(
        http: Http
    ) {
        super(http);
    }

    /**
     * 获取系统安全配置接口
     */
    getSystemSecurityConfig() {
        let url = `${this.baseUrl}/system/sysLoginConfig`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 保存系统安全配置接口
     */
    saveSystemSecurityConfig(param: any) {
        let url = `${this.baseUrl}/system/sysLoginConfig`;
        return this.http.post(url, param)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

}
