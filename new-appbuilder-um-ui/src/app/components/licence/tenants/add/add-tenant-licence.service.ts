import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../common/services/crud.service";

@Injectable()
export class AddTenantLicenceService extends CRUDService{
    addAppUrl = window['appConfig']['apiCode']+'/tenantLicenceController/saveTenantLicence';
    checkTenantLicenceUrl = window['appConfig']['apiCode']+'/tenantLicenceController/checkTenantLicence';
    queryLicenceUrl = window['appConfig']['apiCode']+'/licenceController/getLicenceDetail';
    constructor(public http: Http) {
        super(http);
    }
    addLicence(app:any) {
        return this.http.post(`${this.addAppUrl}`, app,{headers: this.headers}) 
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    checkTenantLicence(app:any) {
        return this.http.post(`${this.checkTenantLicenceUrl}`, app,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    queryLicence(licence:any) {
        return this.http.post(`${this.queryLicenceUrl}`, licence,{headers: this.headers}) 
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


   
}