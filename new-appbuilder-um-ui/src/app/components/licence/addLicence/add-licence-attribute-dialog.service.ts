import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddLicenceAttributeDialogService {
    addUrl = window['appConfig']['apiCode']+'/appController/insertAppAttribute';

    constructor(private http: HttpClient) {

    }

    addLicenceAtttibute(app:any,appId:any) {
        return this.http.post(`${this.addUrl}`, {
            params: app,
            appId:appId
        })
    }
   
}