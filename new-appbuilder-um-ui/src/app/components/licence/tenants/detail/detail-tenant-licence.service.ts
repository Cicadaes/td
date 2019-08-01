import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../common/services/crud.service";

@Injectable()
export class DetailTenantLicenceService extends CRUDService{
    addAppUrl = window['appConfig']['apiCode']+'/tenantLicenceController/saveTenantLicence';
    getLicenceUrl = window['appConfig']['apiCode']+'/tenantLicenceController/getTenantLicenceDetail';
    getTenantLicenceAttributeUrl:string = window['appConfig']['apiCode']+'/tenantLicenceController/getTenantLicenceAttributeList';
    updateTenantLicenceUrl:string = window['appConfig']['apiCode']+'/tenantLicenceController/updateTenantLicence';
    constructor(public http: Http) {
        super(http);
    }
    addLicence(app:any) {
        return this.http.post(`${this.addAppUrl}`, app) .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    getLicence(app:any) {
        return this.http.post(`${this.getLicenceUrl}`, app) .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    getTenantsLicencesAttributes(params:any) {
        return this.http.post(`${this.getTenantLicenceAttributeUrl}`,params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }
    updateTenantLicence(params:any) {
        return this.http.post(`${this.updateTenantLicenceUrl}`,params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }


   
}