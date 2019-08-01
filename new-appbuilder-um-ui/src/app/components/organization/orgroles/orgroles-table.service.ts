import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class UgRolesTableService {
    getRolesUrl:string = window['appConfig']['apiCode']+'/userGroup/getRolesByUserGroup';
    getUgRoles(params:any) {
       return this.http.post(`${this.getRolesUrl}`, params)
    }

    getUserGroupUrl = window['appConfig']['apiCode']+'/userGroup/queryUserGroupById';
    getUserGroupPageDetail(id: number){
        return this.http.post(`${this.getUserGroupUrl}`, {id:id});
    }

    revokeRole:string = window['appConfig']['apiCode']+'/role/revokeRole';
    deleteRolesFromUserGroup(userGroup:any, uids:string) {
        let param={
            roleId:uids,
            vroleId:userGroup.id
        };
        return this.http.post(`${this.revokeRole}`, param)
    }

    constructor(private http: HttpClient) {
    }
}