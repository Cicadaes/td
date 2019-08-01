import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../common/services/crud.service";
@Injectable()
export class AuthLicencesTableService extends CRUDService{
    authLicencesUrl:string = window['appConfig']['apiCode']+'/licenceController/queryAuthLicencesTenant';
    getAuthLicences(params:any) {
       return this.http.post(`${this.authLicencesUrl}`,params,{headers: this.headers})
           .toPromise()
           .then(response => response.json())
           .catch(this.handleError);
        
    }
    constructor(public http: Http) {
        super(http);
    }

}