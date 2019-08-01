import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../common/services/crud.service";

@Injectable()
export class OrganizationsService extends CRUDService{

    addUrl = window['appConfig']['apiCode']+'/organizationController/queryOrganizationByTenant';
    queryTenantUrl = window['appConfig']['apiCode']+'/tenant/queryTenantById';
    queryOrganizationUrl = window['appConfig']['apiCode']+'/organizationController/queryOrganizationById';
    deleteOrganizationUrl = window['appConfig']['apiCode']+'/organizationController/deleteOrganization';

    constructor(public http: Http) {
        super(http);
    }

    getOrganizationList(organization:any) {
        return this.http.post(`${this.addUrl}`, organization,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryTenant(tenant:any) {
        return this.http.post(`${this.queryTenantUrl}`, tenant,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    deleteOrganization(organization:any){
        return this.http.post(`${this.deleteOrganizationUrl}`, organization,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryOrganization(tenant:any) {
        return this.http.post(`${this.queryOrganizationUrl}`, tenant,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
   
}