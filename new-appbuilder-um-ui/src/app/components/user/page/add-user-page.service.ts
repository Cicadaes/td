import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../common/services/crud.service";

@Injectable()
export class AddUserPageService extends CRUDService {
    addUserUrl = '/console-api/user/insertOrUpdateUser';

    constructor(public http: Http) {
        super(http);
    }

    addUser(user:any) {
        if(user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        return this.poste(this.addUserUrl, user);
    }
   
}