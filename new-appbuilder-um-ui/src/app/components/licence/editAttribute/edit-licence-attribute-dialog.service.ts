import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class EditLicenceAttributeDialogService {
    addUrl = window['appConfig']['apiCode']+'/licenceController/saveOrUpdateLicenceAttribute';

    constructor(private http: HttpClient) {

    }

    editLicenceAtttibute(licence:any) {
        return this.http.post(`${this.addUrl}`, licence)
    }
   
}