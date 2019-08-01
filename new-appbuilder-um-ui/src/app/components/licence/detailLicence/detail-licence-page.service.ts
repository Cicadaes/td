import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../common/services/crud.service";

@Injectable()
export class DetailLicencePageService  extends CRUDService {
    getLicenceDetailUrl = window['appConfig']['apiCode']+'/licenceController/getLicenceDetail';
    getLicenceAttributeUrl = window['appConfig']['apiCode']+'/licenceController/getLicenceAttributeList';
    deleteLicenceAttributeUrl=window['appConfig']['apiCode']+'/licenceController/deleteLicenceAttribute';
    getAppListUrl=window['appConfig']['apiCode']+"/licenceController/queryAppListByLicence";
    updateAppListUrl=window['appConfig']['apiCode']+"/licenceController/updateAppList";
    constructor(public http: Http) {
        super(http);
    }

    getAppPageDetail(id: number){
        let params = {
            id:id
        };
        return this.http.post(`${this.getLicenceDetailUrl}`, params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getLicenceAttribute(id: number){
        let params = {
            licenceId:id
        };
        return this.http.post(`${this.getLicenceAttributeUrl}`, params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    deleteLicenceAttribute(params:any) {
        return this.http.post(`${this.deleteLicenceAttributeUrl}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }
    queryLicencesAppList(params:any) {
        return this.http.post(`${this.getAppListUrl}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    updateLicenceAppList(params:any) {
        return this.http.post(`${this.updateAppListUrl}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }


   
}