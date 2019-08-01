import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddUserGroupPageService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    addUserGroupUrl = '/console-api/userGroup/insertOrUpdateUserGroup';
    addUserGroup(userGroup:any) {
        return this.poste(this.addUserGroupUrl, userGroup);
    }

    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUserGroup(userGroup:any) {
        let params = {id:userGroup};
        return this.poste(this.getUserGroupUrl, params);
    }


   
}