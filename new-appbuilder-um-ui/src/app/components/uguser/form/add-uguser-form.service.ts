import { Component, Injectable } from '@angular/core';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';

@Injectable()
export class AddUgUserFormService extends CRUDService {
    queryOrganizationByTenant = '/console-api/organizationController/queryOrganizationByTenantForTree';
    getOrgUrl = '/console-api/user/queryOrgByUser';
    queryOrgByIdUrl = '/console-api/organizationController/queryOrganizationById';
    queryOneEmailByIdUrl = '/console-api/user/checkUser';

    constructor(public http: Http) {
        super(http);
    }

    getUgUserListUrl = '/console-api/user/queryUserList';
    getUgUserList(user: any) {
        return this.poste(this.getUgUserListUrl, user);
    }

    queryOrganizations(user: any) {
        return this.poste(this.queryOrganizationByTenant, user);
    }

    queryOrganization(params: any) {
        return this.poste(this.getOrgUrl, params);
    }

    queryOrgById(id: any) {
        return this.poste(this.queryOrgByIdUrl, {id: id});
    }

    queryOneEmailById(user: any) {
        return this.poste(this.queryOneEmailByIdUrl, user);
    }
}
