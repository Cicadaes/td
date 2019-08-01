import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';

@Injectable()
export class DetailUserGroupPageService extends CRUDService {
    revokeUser = '/console-api/role/revokeUser';
    revokeRole = '/console-api/role/revokeRole';
    updateAppListUrl = '/console-api/userGroup/updateUserGroupAppList';
    getLicenceDetailUrl = '/console-api/licenceController/getLicenceDetail';
    getLicenceAttributeUrl = '/console-api/licenceController/getLicenceAttributeList';
    getAppListUrl = '/console-api/userGroup/queryAppListByUserGroup';
    queryAuthUserGroupUrl = '/console-api/virtualroleRoleRel/queryUserGroupListByRoleId';

    constructor(public http: Http) {
        super(http);
    }

    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUserGroupPageDetail(id: number) {
        return this.poste(this.getUserGroupUrl, {id: id});
    }

    deleteUsersFromUserGroup(userGroup: any, ids: string) {
        const params = {
            userIdSet: ids,
            vroleId: userGroup.id
        };
        return this.http
            .post(this.revokeUser, JSON.stringify(params), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deleteRolesFromUserGroup(userGroup: any, ids: string) {
        const params = {
            roleIdSet: ids,
            vroleId: userGroup.id
        };
        return this.poste(this.revokeRole, params);
    }

    updateUserGroupAppList(params: any) {
        return this.poste(this.updateAppListUrl, params);
    }

    getAppPageDetail(id: number) {
        const params = {id: id};
        return this.poste(this.getLicenceDetailUrl, params);
    }

    getLicenceAttribute(id: number) {
        const params = {licenceId: id};
        return this.poste(this.getLicenceAttributeUrl, params);
    }

    queryAppListByUserGroup(params: any) {
        return this.poste(this.getAppListUrl, params);
    }

    getRoleUserGroup(params: any) {
      return this.poste(`${this.queryAuthUserGroupUrl}`, params);
    }
}
