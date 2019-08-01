import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CRUDService } from "../common/services/crud.service";
import { Http } from "@angular/http";

@Injectable()
export class LogsService extends CRUDService {
    tenantId: any;
    /**
     * 当前账户等级
     */
    condition() {
        if (window['appConfig'] && window['appConfig'].tenant) {
            if (window['appConfig'].tenant.id != null) {
                this.tenantId = window['appConfig'].tenant.id;
            } else {
                this.tenantId = 0;
            }
        } else {
            this.tenantId = 0;
        }
    }
    getLogByIdUrl: string = '/console-api/log/getLogById/';
    getLogById(logId: number) {
        let param: any = { logId: logId };
        return this.http
            .post(this.getLogByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryLogByPageUrl: string = '/console-api/log/queryLogByPage/';
    queryLogByPage(log: any) {
        return this.http
            .post(this.queryLogByPageUrl, JSON.stringify(log), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    user: any = {};
    getUser(): Promise<any> {
        if (window['appConfig'] && window['appConfig'].user) {
            this.user = window['appConfig'].user;
        }
        return Promise.resolve(this.user);
    }

    rolecode: any = {};
    getRoleCode(): Promise<any> {
        if (window['appConfig'] && window['appConfig'].rolecode) {
            this.rolecode = window['appConfig'].rolecode;
        }
        return Promise.resolve(this.rolecode);
    }

    getselectByIdUrl: string = '/console-api/log/queryParam';
    appName(logId: any) {
        let param: any = { appName: '' };
        return this.http
            .post(this.getselectByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    operType(logId: any) {
        let param: any = { operType: '' };
        return this.http
            .post(this.getselectByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    operObjectType(logId: any) {
        let param: any = { operObjectType: '' };
        return this.http
            .post(this.getselectByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    constructor(public http: Http) {
        super(http);
    }
}