import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {DetailTenantUserPageComponent} from "./detail-tenantuser-page.component";
import {Http} from "@angular/http";
import {CRUDService} from "../../common/services/crud.service";

@Injectable()
export class DetailTenantUserPageService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    getUgUserByIdUrl = '/console-api/user/queryUserById';
    getUgUserById(id:number) {
        return this.poste(this.getUgUserByIdUrl, {id:id});
    }

    getUserGroupUrl = '/console-api/userGroup/queryUserGroupById';
    getUserGroupPageDetail(id: number){
        return this.poste(this.getUserGroupUrl, {id:id});
    }

    revokeUser:string = '/console-api/role/revokeUser';
    deleteUsersFromUserGroup(userGroup:any, uids:string) {
        let params={
            userIdSet:uids,
            vroleId:userGroup.id
        };
        return this.poste(this.revokeUser, params);
    }
    deleteUserGroupsFromUser(user:any, uids:string) {
        let params={
            userId:user.id,
            vroleIdSet:uids
        };
        return this.poste(this.revokeUser, params);
    }

    revokeRole:string = '/console-api/role/revokeRole';
    deleteRolesFromUser(userGroup:any, uids:string) {
        let params={
            roleIdSet:uids,
            vroleId:userGroup.id
        };
        return this.poste(this.revokeRole, params);
    }
    deleteRolesFromUserGroup(userGroup:any, uids:string) {
        let params={
            roleId:uids,
            vroleId:userGroup.id
        };
        return this.poste(this.revokeRole, params);
    }


    updateAppListUrl="/console-api/userGroup/updateUserAppList";
    updateUserAppList(params:any) {
        return this.poste(this.updateAppListUrl, params);
    }

    getLicenceDetailUrl = '/console-api/licenceController/getLicenceDetail';
    getAppPageDetail(id: number){
        let params = {id:id};
        return this.poste(this.getLicenceDetailUrl, params);
    }

    getLicenceAttributeUrl = '/console-api/licenceController/getLicenceAttributeList';
    getLicenceAttribute(id: number){
        let params = {licenceId:id};
        return this.poste(this.getLicenceAttributeUrl, params);
    }

    getAppListUrl="/console-api/userGroup/queryAppListByUser";
    queryAppListByUser(params:any) {
        return this.poste(this.getAppListUrl, params);
    }
}