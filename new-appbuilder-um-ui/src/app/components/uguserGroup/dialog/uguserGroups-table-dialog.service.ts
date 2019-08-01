import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddUgUserGroupDialogService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    addUgUserGroupUrl = '/console-api/userGroup/insertOrUpdateUgUserGroup';
    addUgUserGroup(userGroup:any) {
        return this.poste(this.addUgUserGroupUrl, userGroup);
    }

    authUserUrl = '/console-api/role/authorizeUser';
    addUserToUserGroups(params:any) {
        return this.poste(this.authUserUrl, params);
    }

    revokeUserUrl = '/console-api/role/revokeUser';
    deleteUserToUserGroup(params:any) {
        return this.poste(this.revokeUserUrl, params);
    }
   
}