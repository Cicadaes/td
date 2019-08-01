import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../../common/services/crud.service";
@Injectable()
export class TlicencesAttributeTableService extends CRUDService {
    getTenantsLicenceUrl:string = window['appConfig']['apiCode']+'/licenceController/getLicenceAttributeList';
    getTenantsLicencesAttribute(params:any) {
       return this.http.post(`${this.getTenantsLicenceUrl}`,params)
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);
        
    }

    constructor(public http: Http) {
        super(http);
    }

}