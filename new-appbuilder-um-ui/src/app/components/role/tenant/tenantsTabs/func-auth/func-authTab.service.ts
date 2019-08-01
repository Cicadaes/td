import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class FuncAuthService extends CRUDService{
    queryTenantApp(roleApp:any) {
        let queryTenantAppUrl = '/console-api/role/queryTenantApp';
        return this.http
            .post(queryTenantAppUrl, JSON.stringify(roleApp), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryVRoleApp(roleApp:any) {
        let queryVRoleAppUrl = '/console-api/role/queryVRoleApp';
        return this.http
            .post(queryVRoleAppUrl, JSON.stringify(roleApp), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryAppFuncType(roleApp:any) {
        let queryAppFuncTypeUrl = '/console-api/role/queryAppFuncType';
        return this.http
            .post(queryAppFuncTypeUrl, JSON.stringify(roleApp), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    authorizeFunctionListUrl:string = '/console-api/role/authorizeFunctionList';
    authorizeFunctionList(data:any) {
        return this.http
            .post(this.authorizeFunctionListUrl, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryTenantAppList(tenant: any){
        let getAllAppListUrl = '/console-api/appController/queryTenantAppAllList';
        return this.http.post(`${getAllAppListUrl}`, tenant,{headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    queryAppListByRoleId(data:any) {
        let queryAppListByRoleIdUrl:string = '/console-api/role/queryAppListByRoleId';
        return this.http
            .post(queryAppListByRoleIdUrl, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }
}