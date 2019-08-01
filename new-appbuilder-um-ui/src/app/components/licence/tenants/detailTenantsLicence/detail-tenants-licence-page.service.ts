import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {DetailTenantsLicencePageRoutingModule} from "./detail-tenants-licence-page-routing.module";

@Injectable()
export class DetailTenantsLicencePageService {
    getLicenceDetailUrl = window['appConfig']['apiCode']+'/licenceController/getLicenceDetail';
    getLicenceAttributeUrl = window['appConfig']['apiCode']+'/licenceController/getLicenceAttributeList';
    deleteLicenceAttributeUrl=window['appConfig']['apiCode']+'/licenceController/deleteLicenceAttribute';

    constructor(private http: HttpClient) {

    }

    getAppPageDetail(id: number){
        let params = {
            id:id
        };
        return this.http.post(`${this.getLicenceDetailUrl}`, params);
    }

    getLicenceAttribute(id: number){
        let params = {
            licenceId:id
        };
        return this.http.post(`${this.getLicenceAttributeUrl}`, params);
    }

    deleteLicenceAttribute(params:any) {
        return this.http.post(`${this.deleteLicenceAttributeUrl}`,params)

    }
   
}