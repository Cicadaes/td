import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { CRUDService } from "../../components/common/services/crud.service";

@Injectable()
export class TopService extends CRUDService {
    logoutUrl:string = '/console-api/user/logout';
    getUser(): Promise<any> {
        let user: any = {};
        if(window['appConfig'] && window['appConfig'].user){
            user = window['appConfig'].user;
        }
        return Promise.resolve(user);
    }

    logout() {
        return this.http.get(this.logoutUrl, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }
   
}