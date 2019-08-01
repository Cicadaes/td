import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddUserFormService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    getUsersUrl:string = '/console-api/user/queryUserList';
    getUsers(params:any) {
        return this.poste(this.getUsersUrl, params);
    }

    getUgUserListUrl = '/console-api/user/queryUserList';
    getUgUserList(user:any) {
        return this.poste(this.getUgUserListUrl, user);
    }

    queryOneEmailByIdUrl = '/console-api/user/checkUser';
    queryOneEmailById(user: any) {
        return this.poste(this.queryOneEmailByIdUrl, user);
    }


}
