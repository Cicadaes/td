import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Http} from "@angular/http";
import { CRUDService } from "./components/common/services/crud.service";

@Injectable()
export class AppService extends CRUDService {
    getAppConfigUrl:string = '/console-api/index';

    constructor(public http: Http) {
        super(http);
    }

    getAppConfig() {
        //return this.http.get(`${this.getAppConfigUrl}`);
        return this.http.get(`${this.getAppConfigUrl}`, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
   
}