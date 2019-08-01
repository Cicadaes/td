import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CRUDService } from "./service/crud.service";

@Injectable()
export class AppService extends CRUDService {

    globalUrlIp: string = "";

    constructor(http: Http) {
        super(http);
        this.baseUrl = "/report-api";
    }

    /**
     * 获取参数信息
     * @param dataSourceId
     */
    public queryParam(param: { modelCode: string, key: string }): Promise<any[]> {
        let url = `${this.baseUrl}/config/params/getParam`;
        return this.http.post(url, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => {
                if (!sessionStorage.getItem('x-client-token') && response.headers['_headers'] && response.headers['_headers'].get("x-client-token")) {
                    sessionStorage.setItem('x-client-token', response.headers['_headers'].get("x-client-token")[0]);
                }

                return response;
            })
            .catch(this.handleError);
    }

}