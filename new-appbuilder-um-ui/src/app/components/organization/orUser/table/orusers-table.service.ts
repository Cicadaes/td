import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class OrUsersTableService {
    getUgUsersUrl: string = window['appConfig']['apiCode'] + '/user/queryTenantUserList';
    queryRoleByUserUrl: string = window['appConfig']['apiCode'] + '/user/queryRoleByUser';
    revokeUser: string = window['appConfig']['apiCode'] + '/role/revokeUser';
    batchRevokeUser: string = window['appConfig']['apiCode'] + '/role/batchRevokeUser';
    getUserGroupUrl = window['appConfig']['apiCode'] + '/userGroup/queryUserGroupById';

    getUgUsers(params: any) {
        return this.http.post(`${this.getUgUsersUrl}`, params);
    }
    queryRoleByUser(params: any) {
        return this.http.post(`${this.queryRoleByUserUrl}`, params);
    }
    deleteUserFromUserGroup(userGroup: any, user: any) {
        const param = {
            userId: user.id,
            vroleId: userGroup.id
        };
        return this.http.post(`${this.revokeUser}`, param);
    }
    deleteUsersFromUserGroup(userGroup: any, uids: string) {
        const param = {
            userId: uids,
            vroleId: userGroup.id
        };
        return this.http.post(`${this.revokeUser}`, param);
    }

    getUserGroupPageDetail(id: number) {
        return this.http.post(`${this.getUserGroupUrl}`, { id: id });
    }

    constructor(private http: HttpClient) {
    }

}
