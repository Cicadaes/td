import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../../common/services/crud.service";

@Injectable()
export class TenantsAppTableService extends CRUDService{
    getAppUrl:string = window['appConfig']['apiCode']+'/appController/queryTenantAppList';
    getTenantAppFuncUrl:string = window['appConfig']['apiCode']+'/appController/queryTenantAppFunc';
    getApps(params:any) {
       return this.http.post(`${this.getAppUrl}`,params,{headers: this.headers})
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);

    }
    queryTenantAppFunc(params:any) {
        return this.http.post(`${this.getTenantAppFuncUrl}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }


    constructor(public http: Http) {
        super(http);
    }

}
