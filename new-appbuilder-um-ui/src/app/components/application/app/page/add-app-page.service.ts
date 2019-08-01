import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddAppPageService {
    addAppUrl = window['appConfig']['apiCode']+'/appController/insertOrUpdateApp';

    constructor(private http: HttpClient) {

    }
    addApp(app:any) {
        return this.http.post(`${this.addAppUrl}`, {
            params: app
        })
    }
   
}