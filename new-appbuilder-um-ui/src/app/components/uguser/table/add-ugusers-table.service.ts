import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';
@Injectable()
export class AddUgUsersTableService extends CRUDService {
    getNoOrgUsersUrl = window['appConfig']['apiCode'] + '/user/queryTenantNoUserGroupUserList';
    queryRoleByUserUrl = '/console-api/user/queryRoleByUser';
    getUgUsersUrl = '/console-api/user/queryTenantUserList';
    revokeUser = '/console-api/role/revokeUser';
    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';

    getUgUsers(params: any) {
        return this.poste(this.getUgUsersUrl, params);
    }

    // getNoOrgUsersUrl:string = window['appConfig']['apiCode']+'/user/queryTenantNoOrgUserList';
    getNoOrgUsers(params: any) {
        return this.poste(`${this.getNoOrgUsersUrl}`, params);
    }

    queryRoleByUser(params: any) {
        return this.poste(this.queryRoleByUserUrl, params);
    }

    deleteUserFromUserGroup(userGroup: any, user: any) {
        const params = {
            userId: user.id,
            vroleId: userGroup.id
        };
        return this.poste(this.revokeUser, params);
    }
    deleteUsersFromUserGroup(userGroup: any, uids: string) {
        const params = {
            userId: uids,
            vroleId: userGroup.id
        };
        return this.poste(this.revokeUser, params);
    }

    getUserGroupPageDetail(id: number) {
        const params = {id: id};
        return this.poste(this.getUserGroupUrl, params);
    }

    constructor(public http: Http) {
        super(http);
    }

}
