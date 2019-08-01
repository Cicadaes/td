import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../common/services/crud.service";

@Injectable()
export class InstanceLicencePageService  extends CRUDService {
    addlicenceUrl = window['appConfig']['apiCode']+'/licenceController/saveOrUpdateLicence';
    queryTenantsInstanceUrl = window['appConfig']['apiCode']+'/tenantLicenceController/getTenantLicence';
    constructor(public http: Http) {
        super(http);
    }
    addApp(licence:any) {
        return this.http.post(`${this.addlicenceUrl}`, {
            params: licence
        })
    }

    editLicence(licence:any) {
        return this.http.post(`${this.addlicenceUrl}`, licence)
    }

    queryTenantsInstance(licence:any) {
        return this.http.post(`${this.queryTenantsInstanceUrl}`, licence) .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

   
}