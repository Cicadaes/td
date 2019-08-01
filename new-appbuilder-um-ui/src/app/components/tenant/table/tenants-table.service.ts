import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";
@Injectable()
export class TenantsTableService extends CRUDService {

    getTenantsUrl:string = '/console-api/tenant/queryTenantList';
    getTenants(params:any) {
        return this.poste(this.getTenantsUrl, params);
    }

    getTenantUrl:string = '/console-api/tenant/queryTenantById';
    queryTenantById(params:any) {
        return this.poste(this.getTenantUrl, params);
    }

    constructor(public http: Http) {
        super(http);
    }

}