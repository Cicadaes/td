import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddTenantuserFormService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    getUgUserListUrl = '/console-api/user/queryUserList';
    getUgUserList(user:any) {
        return this.poste(this.getUgUserListUrl, user);
    }

    queryOrganizationByTenant = '/console-api/organizationController/queryOrganizationByTenantForTree';
    queryOrganizations(user:any) {
        return this.poste(this.queryOrganizationByTenant, user);
    }

    getOrgUrl = '/console-api/user/queryOrgByUser';
    queryOrganization(params:any) {
        return this.poste(this.getOrgUrl, params);
    }

    queryOrgByIdUrl = '/console-api/organizationController/queryOrganizationById';
    queryOrgById(id:any) {
        return this.poste(this.queryOrgByIdUrl, {id:id});
    }

    getUsersUrl:string = '/console-api/user/queryTenantUserList';
    getUsers(params:any) {
        return this.poste(this.getUsersUrl, params);
    }

    queryOneEmailByIdUrl = '/console-api/user/checkUser';
    queryOneEmailById(user: any) {
        return this.poste(this.queryOneEmailByIdUrl, user);
    }

    addUrl = window['appConfig']['apiCode']+'/organizationController/queryOrganizationByTenant';
    getOrganizationList(organization:any) {
        return this.http.post(`${this.addUrl}`, organization)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


}
