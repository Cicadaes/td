import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddLicencePageService {
    addAppUrl = window['appConfig']['apiCode']+'/licenceController/saveOrUpdateLicence';
    queryLicenceByNameUrl = window['appConfig']['apiCode']+'/licenceController/queryLicenceByName';
    queryOneNameByIdUrl = window['appConfig']['apiCode']+'/licenceController/checkLicence';

    constructor(private http: HttpClient) {

    }
    addLicence(app:any) {
        return this.http.post(`${this.addAppUrl}`, app)
    }
    queryLicenceByName(app:any) {
        return this.http.post(`${this.queryLicenceByNameUrl}`, app)
    }
   
    
    queryOneNameById(user: any) {
        return this.http.post(this.queryOneNameByIdUrl, user);
    }

}