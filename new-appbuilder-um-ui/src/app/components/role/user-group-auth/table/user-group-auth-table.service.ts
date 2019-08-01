import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {UserGroupAuthTableComponent} from "./user-group-auth-table.component";
@Injectable()
export class UserGroupAuthTableService {
    queryAuthUserGroupUrl:string = '/console-api/virtualroleRoleRel/queryUserGroupListByRoleId';
    deleteUserGroupRoleRELUrl:string = '/console-api/virtualroleRoleRel/deleteUserGroupRoleREL';
    queryUserGroupUrl:string = '/console-api/virtualroleRoleRel/queryUserGroupListNoInRoleId';
    batchDeletingUserGroupRoleRELUrl:string = '/console-api/virtualroleRoleRel/batchDeletingUserGroupRoleREL';


    constructor(private http: HttpClient) {
    }

    getAuthUserGroup(params:any) {
        return this.http.post(`${this.queryAuthUserGroupUrl}`, params)
    }
    getUserGroupList(params:any) {
        return this.http.post(`${this.queryUserGroupUrl}`, params)
    }
    deleteUserGroupRoleREL(params:any) {
        return this.http.post(`${this.deleteUserGroupRoleRELUrl}`, params)
    }

    batchDeletingUserGroupRoleREL(params:any) {
        return this.http.post(`${this.batchDeletingUserGroupRoleRELUrl}`,params)
    }

}