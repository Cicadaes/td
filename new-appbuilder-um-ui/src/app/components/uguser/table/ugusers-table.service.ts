import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';
@Injectable()
export class UgUsersTableService extends CRUDService {
    queryRoleByUserUrl = '/console-api/user/queryRoleByUser';
    revokeUser = '/console-api/role/revokeUser';
    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUgUsersUrl = '/console-api/user/queryTenantUserList';
    getUgUsers(params: any) {
        return this.poste(this.getUgUsersUrl, params);
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
