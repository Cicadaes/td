import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../common/services/crud.service";
@Injectable()
export class OrgRolesTableService extends CRUDService {
    getRolesUrl:string = '/console-api/organizationController/queryRolesListByOrganizationIn';
    getUgRoles(params:any) {
        return this.poste(this.getRolesUrl, params);
    }

    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUserGroupPageDetail(id: number){
        let params={id:id};
        return this.poste(this.getUserGroupUrl, params);
    }

    revokeRole:string = '/console-api/role/revokeRole';
    deleteRolesFromUserGroup(userGroup:any, uids:string) {
        let params={
            roleId:uids,
            vroleId:userGroup.id
        };
        return this.poste(this.revokeRole, params);
    }
    deleteRolesFromUser(userGroup:any, uids:string) {
        let params={
            roleIdSet:uids,
            vroleId:userGroup.id
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