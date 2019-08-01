import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddTenantUserDialogService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    addUserUrl = '/console-api/user/insertOrUpdateUser';
    addUser(user:any) {
        if(user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        return this.poste(this.addUserUrl, user);
    }
   
}