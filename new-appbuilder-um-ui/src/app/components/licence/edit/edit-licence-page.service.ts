import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class EditLicencePageService {
    addlicenceUrl = window['appConfig']['apiCode']+'/licenceController/saveOrUpdateLicence';
    queryAuthTenantsUrl = window['appConfig']['apiCode']+'/licenceController/queryAuthTenants';
    queryLicenceByNameUrl = window['appConfig']['apiCode']+'/licenceController/queryLicenceByName';
    queryOneNameByIdUrl = window['appConfig']['apiCode']+'/licenceController/checkLicence';
    constructor(private http: HttpClient) {

    }
    addApp(licence:any) {
        return this.http.post(`${this.addlicenceUrl}`, {
            params: licence
        })
    }
    queryAuthTenants(licence:any) {
        return this.http.post(`${this.queryAuthTenantsUrl}`, licence)
    }

    editLicence(licence:any) {
        return this.http.post(`${this.addlicenceUrl}`, licence)
    }
    queryLicenceByName(app:any) {
        return this.http.post(`${this.queryLicenceByNameUrl}`, app)
    }
    queryOneNameById(user: any) {
        return this.http.post(this.queryOneNameByIdUrl, user);
    }


   
}