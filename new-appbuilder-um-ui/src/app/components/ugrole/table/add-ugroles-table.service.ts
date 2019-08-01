import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';
@Injectable()
export class AddUgRolesTableService extends CRUDService {
    getRolesUrl:string = '/console-api/userGroup/getRolesForPageNoInUg';
    getAddUgRoles(params: any) {
        return this.poste(this.getRolesUrl, params);
    }

    getUserGroupsUrl:string = '/console-api/user/queryUserGroupByUser';
    // getUserGroupsUrl:string = '/console-api/virtualroleRoleRel/queryUserGroupListByRoleId';
    getUserGroups(params: any) {
        return this.poste(this.getUserGroupsUrl, params);
    }

    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUserGroupPageDetail(id: number) {
        const params = {id: id};
        return this.poste(this.getUserGroupUrl, params);
    }

    revokeUser:string = '/console-api/role/revokeUser';
    deleteRoleFromUserGroup(userGroup: any, uids: string) {
        const params = {
            userId: uids,
            vroleId: userGroup.id
        };
        return this.poste(this.revokeUser, params);
    }

    revokeRole:string = '/console-api/role/revokeRole';
    deleteRolesFromUser(user: any, rids: string) {
        const params={
            roleIdSet: rids,
            vroleId: user.id
        };
        return this.poste(this.revokeRole, params);
    }

    getUgUserByIdUrl = '/console-api/user/queryUserById';
    getUgUserById(id: number) {
        const params = {id: id};
        return this.poste(this.getUgUserByIdUrl, params);
    }

    queryRoleGroupUrl:string = '/console-api/virtualroleRoleRel/queryUserGroupListNoInRoleId';
    getRoleGroupList(params: any) {
        return this.poste(`${this.queryRoleGroupUrl}`, params);
    }

    constructor(public http: Http) {
        super(http);
    }
}
