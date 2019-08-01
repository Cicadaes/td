import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CRUDService } from "../common/services/crud.service";
@Injectable()
export class ConfigurationService extends CRUDService {
    constructor(public http: Http) {
        super(http);
    }
    /**
     * 主页配置保存
     * @param parmas 
     */
    pageConfigurationSave(parmas: number) {
        let getUserByIdUrl: string = '/console-api/appHomePageController/updataAppHomePage';
        return this.http
            .post(getUserByIdUrl, JSON.stringify(parmas), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    /**
     * 主页配置读取
     * @param parmas 
     */
    pageConfigurationRead(parmas: number) {
        let getUserByIdUrl: string = '/console-api/appHomePageController/getAppHomePage';
        return this.http
            .post(getUserByIdUrl, JSON.stringify(parmas), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}