import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class AdditionalAppsTableService {
    getLicencesUrl:string = window['appConfig']['apiCode']+'/appController/queryAdditionalAppList';
    getLicences(params:any) {
       return this.http.post(`${this.getLicencesUrl}`,params)
        
    }
    constructor(private http: HttpClient) {
    }

}