import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class CheckLicenceDialogService {
    addlicenceUrl = window['appConfig']['apiCode']+'/licenceController/saveOrUpdateLicence';

    constructor(private http: HttpClient) {

    }
    addApp(licence:any) {
        return this.http.post(`${this.addlicenceUrl}`, {
            params: licence
        })
    }

    editLicence(licence:any) {
        return this.http.post(`${this.addlicenceUrl}`, licence)
    }

   
}