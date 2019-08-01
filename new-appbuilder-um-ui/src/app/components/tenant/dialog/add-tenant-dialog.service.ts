import { Component, Injectable } from '@angular/core';
import { CRUDService } from '../../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class AddTenantDialogService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    addTenantUrl = '/console-api/tenant/insertOrUpdateTenant';
    addTenant(tenant: any) {
        if (tenant.status) {
            tenant.status = 0;
        } else {
            tenant.status = 1;
        }
        if (tenant.hasContactInfo) {
            tenant.hasContactInfo = 1;
        } else {
            tenant.hasContactInfo = 0;
        }
        return this.poste(this.addTenantUrl, tenant);
    }
}
