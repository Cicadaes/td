import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from "../../common/services/crud.service";
import { Headers, Http } from '@angular/http';
import { NameService } from '../../common/services/rsa.service';

@Injectable()
export class AddUserDialogService extends CRUDService {

    constructor(public http: Http, public NameService: NameService, ) {
        super(http);
    }

    addUserUrl = '/console-api/user/insertOrUpdateUser';
    addUser(user: any) {
        if (user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        if (user && user.password && user.checkPassword) {
            user.password = this.NameService.encodersa(user.password);
            user.checkPassword = this.NameService.encodersa(user.checkPassword);
        }
        return this.poste(this.addUserUrl, user);
    }

    getUgUserListUrl = '/console-api/user/queryUserList';
    getUgUserList(user: any) {
        let pamams = {};
        if (user.id) {
            pamams = {
                vid: user.id,
                vemail: user.email
            };
        } else {
            pamams = {
                vemail: user.email
            };
        }
        return this.poste(this.getUgUserListUrl, pamams);
    }

}