import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class LicencesTableService {
    getLicenceUrl:string = window['appConfig']['apiCode']+'/licenceController/queryLicenceList';
    getLicences(params:any) {
       return this.http.post(`${this.getLicenceUrl}`,params)
        
    }


    constructor(private http: HttpClient) {
    }

}