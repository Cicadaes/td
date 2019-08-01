import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddUgUserPageService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    addUgUserUrl = '/console-api/user/insertOrUpdateUser';
    addUgUser(user:any) {
        if(user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        return this.poste(this.addUgUserUrl, user);
    }

    getUgUserByIdUrl = '/console-api/user/queryUserById';
    getUgUserById(user:any) {
        let params = {id:user};
        return this.poste(this.getUgUserByIdUrl, params);
    }
   
}