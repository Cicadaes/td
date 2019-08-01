import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";
@Injectable()
export class UserGroupsTableService extends CRUDService {

    getUserGroupsUrl:string = '/console-api/userGroup/queryUserGroupList';
    getUserGroups(params:any) {
        return this.poste(this.getUserGroupsUrl, params);
    }

    queryRoleByUserGroupUrl:string = '/console-api/userGroup/queryRoleByUserGroup';
    queryRoleByUserGroup(params:any) {
        return this.poste(this.queryRoleByUserGroupUrl, params);
    }

    insertOrUpdateUserGroup = '/console-api/userGroup/insertOrUpdateUserGroup';
    updateUserGroup(params:any) {
        return this.poste(this.insertOrUpdateUserGroup, params);
    }

    constructor(public http: Http) {
        super(http);
    }

}