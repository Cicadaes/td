import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddAppDialogService {
    addAppUrl = 'https://api.randomuser.me/';

    constructor(private http: HttpClient) {

    }

    addApp(app:any) {
        return this.http.post(`${this.addAppUrl}`, {
            params: app
        })
    }
   
}