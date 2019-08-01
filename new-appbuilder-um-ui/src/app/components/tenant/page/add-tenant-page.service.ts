import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from '../../common/services/crud.service';
import { NameService } from '../../common/services/rsa.service';
import { Http } from '@angular/http';

@Injectable()
export class AddTenantPageService extends CRUDService {
    getTenantsUrl = '/console-api/tenant/queryTenantList';
    addTenantUrl = '/console-api/tenant/insertOrUpdateTenant';

    constructor(public http: Http, public NameService: NameService) {
        super(http);
    }

    queryTenantById = '/console-api/tenant/queryTenantById';
    getTenantById(id: number) {
        const params = { id: id };
        return this.poste(this.queryTenantById, params);
    }

    getTenants(params: any) {
        return this.poste(this.getTenantsUrl, params);
    }

    addTenant(tenant: any) {
        if (tenant.status) {
            tenant.status = 1;
        } else {
            tenant.status = 0;
        }
        if (tenant.hasContactInfo) {
            tenant.hasContactInfo = 1;
        } else {
            tenant.hasContactInfo = 0;
        }
        if (tenant && tenant.apassword && tenant.acheckPassword) {
            tenant.apassword = this.NameService.encodersa(tenant.apassword);
            tenant.acheckPassword = this.NameService.encodersa(tenant.acheckPassword);
        }
        return this.poste(this.addTenantUrl, tenant);
    }
}
