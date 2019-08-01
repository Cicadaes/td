import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Http} from "@angular/http";
import {CRUDService} from "../../../common/services/crud.service";
@Injectable()
export class AddOrgRolesTableService extends CRUDService {
    getRolesUrl:string = '/console-api/organizationController/queryRolesListByOrganization';
    getAddOrgRoles(params:any) {
        return this.poste(this.getRolesUrl, params);
    }

    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUserGroupPageDetail(id: number){
        let params={id:id};
        return this.poste(this.getUserGroupUrl, params);
    }

    revokeUser:string = '/console-api/role/revokeUser';
    deleteRoleFromUserGroup(userGroup:any, uids:string) {
        let params={
            userId:uids,
            vroleId:userGroup.id
        };
        return this.poste(this.revokeUser, params);
    }

    revokeRole:string = '/console-api/role/revokeRole';
    deleteRolesFromUser(user:any, rids:string) {
        let params={
            roleIdSet:rids,
            vroleId:user.id
        };
        return this.poste(this.revokeRole, params);
    }

    getUgUserByIdUrl = '/console-api/user/queryUserById';
    getUgUserById(id:number) {
        let params={id:id};
        return this.poste(this.getUgUserByIdUrl, params);
    }

    constructor(public http: Http) {
        super(http);
    }
}