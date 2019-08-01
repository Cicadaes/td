import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from '../../common/services/crud.service';
import { Http } from '@angular/http';
@Injectable()
export class UgRolesTableService extends CRUDService {

    getUserGroupsUrl = '/console-api/user/queryUserGroupByUser';
    revokeRoleGp = '/console-api/role/revokeRole';
    getRolesUrl = '/console-api/userGroup/getRolesByUserGroup';
    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    revokeRole = '/console-api/role/revokeRole';
    revokeRole2 = '/console-api/role/revokeUser';
    getUgUserGroupByIdUrl = '/console-api/userGroup/queryUserGroupById';
    queryAuthUserGroupUrl = '/console-api/virtualroleRoleRel/queryUserGroupListByRoleId';
    deleteUserGroupRoleRELUrl = '/console-api/virtualroleRoleRel/deleteUserGroupRoleREL';

    getUserGroups(params: any) {
        return this.poste(this.getUserGroupsUrl, params);
    }

    getUgRoles(params: any) {
        return this.poste(this.getRolesUrl, params);
    }

    getUserGroupPageDetail(id: number) {
        const params = { id: id };
        return this.poste(this.getUserGroupUrl, params);
    }


    // deleteRolesFromUserGroup(userGroupId: any, uids: string) {
    deleteRolesFromUserGroup(params: any) {
        // let params={
        //     roleId:uids,
        //     vroleId:userGroupId
        // };

        // let params = {
        //   userId: userGroupId,
        //   vroleIdSet: uids,
        // };
        return this.poste(this.revokeRole2, params);
    }
    deleteRolesFromUser(userGroup: any, uids: string) {
        const params = {
            roleIdSet: uids,
            vroleId: userGroup.id
        };
        return this.poste(this.revokeRole, params);
    }

    getUgUserGroupById(id: number) {
        const params = { id: id };
        return this.poste(this.getUgUserGroupByIdUrl, params);
    }

    getRoleUserGroup(params: any) {
        return this.poste(`${this.queryAuthUserGroupUrl}`, params);
    }

    deleteUserGroupRoleREL(params: any) {
        return this.http.post(`${this.deleteUserGroupRoleRELUrl}`, params, { headers: this.headers });
    }

    deleteUserGpRole(params: any) {
        return this.poste(this.revokeRole, params);
    }

    constructor(public http: Http) {
        super(http);
    }
}
