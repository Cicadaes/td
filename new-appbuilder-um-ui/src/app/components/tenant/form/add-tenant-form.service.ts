import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";
@Injectable()
export class AddTenantFormService extends CRUDService {

    getTenantUrl:string = '/console-api/tenant/queryTenantById';
    queryTenantById(params:any) {
        return this.poste(this.getTenantUrl, params);
    }

    getUgUserListUrl = '/console-api/user/queryUserList';
    getUgUserList(user:any) {
        return this.poste(this.getUgUserListUrl, user);
    }

    getCompanyNameListUrl = '/console-api/tenant/queryTenantByName';
    getCompanyNameList(tenant:any) {
        return this.poste(this.getCompanyNameListUrl, tenant);
    }

    getTenantsUrl:string = '/console-api/tenant/queryTenantAllList';
    getTenants(params:any) {
        return this.poste(this.getTenantsUrl, params);
    }

    queryOneEmailByIdUrl = '/console-api/user/checkUser';
    queryOneEmailById(user: any) {
        return this.poste(this.queryOneEmailByIdUrl, user);
    }

    queryOneNameByIdUrl = '/console-api/tenant/checkTenant';
    queryOneNameById(user: any) {
        return this.poste(this.queryOneNameByIdUrl, user);
    }

    constructor(public http: Http) {
        super(http);
    }

}
