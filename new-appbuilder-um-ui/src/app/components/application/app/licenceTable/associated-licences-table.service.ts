import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class AssociatedLicencesTableService {
    getLicencesUrl:string = window['appConfig']['apiCode']+'/licenceController/queryAppLicenceList';
    getLicences(params:any) {
       return this.http.post(`${this.getLicencesUrl}`,params)
        
    }


    constructor(private http: HttpClient) {
    }

}