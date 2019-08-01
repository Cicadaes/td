import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class OrgUsersTableDialogService {
    addUgUserUrl = window['appConfig']['apiCode']+'/user/insertOrUpdateUser';

    constructor(private http: HttpClient) {

    }

    addUgUser(user:any) {
        if(user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        return this.http.post(`${this.addUgUserUrl}`, user)
    }
   
}