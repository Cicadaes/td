import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../common/services/crud.service";
@Injectable()
export class TenantsLicencesTableService extends CRUDService {
    getTenantsLicenceUrl:string =window['appConfig']['apiCode']+'/tenantLicenceController/queryTenantLicenceList';
    getTenantsLicences(params:any) {
       return this.http.post(`${this.getTenantsLicenceUrl}`,params,{headers: this.headers})
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);
        
    }


    constructor(public http: Http) {
        super(http);
    }

}