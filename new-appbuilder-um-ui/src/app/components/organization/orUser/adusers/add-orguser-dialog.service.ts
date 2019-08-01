import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NameService } from './../../../common/services/rsa.service';

@Injectable()
export class AddOrgUserDialogService {
    addUgUserUrl = window['appConfig']['apiCode'] + '/user/insertOrUpdateUser';

    constructor(private http: HttpClient, private NameService: NameService) {

    }

    addUgUser(user: any) {
        if (user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        if (user && user.checkPassword && user.password) {
            user.checkPassword = this.NameService.encodersa(user.checkPassword);
            user.password = this.NameService.encodersa(user.password);
        }
        return this.http.post(`${this.addUgUserUrl}`, user)
    }

}