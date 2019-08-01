import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class AddOrgUsersTableService {
    //getUgUsersUrl:string = '/console-api/user/queryTenantUserList';
    queryRoleByUserUrl:string = window['appConfig']['apiCode']+'/user/queryRoleByUser';
    revokeUser:string =window['appConfig']['apiCode']+'/role/revokeUser';
    getUserGroupUrl = window['appConfig']['apiCode']+'/userGroup/queryUserGroupById';
    getNoOrgUsersUrl:string = window['appConfig']['apiCode']+'/user/queryTenantNoOrgUserList';

    getUgUsers(params:any) {
        return this.http.post(`${this.getNoOrgUsersUrl}`, params)
    }
    queryRoleByUser(params:any) {
        return this.http.post(`${this.queryRoleByUserUrl}`, params)
    }
    deleteUserFromUserGroup(userGroup:any, user:any) {
        let param={
            userId:user.id,
            vroleId:userGroup.id
        };
        return this.http.post(`${this.revokeUser}`, param)
    }
    deleteUsersFromUserGroup(userGroup:any, uids:string) {
        let param={
            userId:uids,
            vroleId:userGroup.id
        };
        return this.http.post(`${this.revokeUser}`, param)
    }

    getUserGroupPageDetail(id: number){
        return this.http.post(`${this.getUserGroupUrl}`, {id:id});
    }

    constructor(private http: HttpClient) {
    }

}