import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddActionAttributeDialogService {
    addUrl = '/console-api/appController/insertAppAttribute';

    constructor(private http: HttpClient) {

    }

    addActionAtttibute(app:any,appId:any) {
        return this.http.post(`${this.addUrl}`, {
            params: app,
            appId:appId
        })
    }
   
}