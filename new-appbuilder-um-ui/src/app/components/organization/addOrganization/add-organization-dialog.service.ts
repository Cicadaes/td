import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddOrganizationDialogService {
    addUrl = window['appConfig']['apiCode']+'/organizationController/saveOrganization';
    getUrl = window['appConfig']['apiCode']+'/organizationController/queryOrganization';
    constructor(private http: HttpClient) {

    }

    addOrganization(organization:any) {
        return this.http.post(`${this.addUrl}`, organization)
    }

    queryOrganization(organization:any) {
        return this.http.post(`${this.getUrl}`, organization)
    }

}
