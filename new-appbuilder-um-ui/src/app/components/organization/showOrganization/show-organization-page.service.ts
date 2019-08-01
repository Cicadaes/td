import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Http} from "@angular/http";
import {CRUDService} from "../../common/services/crud.service";

@Injectable()
export class ShowOrganizationPageService extends CRUDService{
    addAppUrl = window['appConfig']['apiCode']+'/licenceController/saveOrUpdateLicence';
    getUserGroupUrl = window['appConfig']['apiCode']+'/userGroup/queryUserGroupById';
    revokeUser:string = window['appConfig']['apiCode']+'/role/revokeUser';
    revokeUsers:string = window['appConfig']['apiCode']+'/organizationController/revokeUser';
    getAppListByOrgUrl = window['appConfig']['apiCode']+'/organizationController/queryAppListByOrg';
    updateAppListUrl=window['appConfig']['apiCode']+'/licenceController/updateAppList';


    getAllAppListUrl = window['appConfig']['apiCode']+'/appController/queryTenantAppAllList';

    constructor(public http: Http) {
        super(http);
    }
    addLicence(app:any) {
        return this.http.post(`${this.addAppUrl}`, app,{headers: this.headers})
    }
    getUserGroupPageDetail(id: number){
        return this.http.post(`${this.getUserGroupUrl}`, {id:id},{headers: this.headers});
    }
    deleteUsersFromUserGroup(userGroup:any, uids:string) {
        let param={
            userIds:uids,
            vroleId:userGroup.id
        };
        return this.http.post(`${this.revokeUsers}`, param,{headers: this.headers})
    }
    revokeRole:string = '/console-api/role/revokeRole';
    deleteRolesFromUserGroup(userGroup:any, ids:string) {
        let params={
            roleIdSet:ids,
            vroleId:userGroup.id
        };
        return this.poste(this.revokeRole, params);
    }
    /**
     * 将参数转换为get请求的参数
     * @param params
     */
    public poste(url: string, params: any): Promise<any> {
        return this.http
            .post(url, JSON.stringify(params), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    queryOrganizationAppList(oraganization: any){
        return this.http.post(`${this.getAppListByOrgUrl}`, oraganization,{headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    updateLicenceAppList(params:any) {
        return this.http.post(`${this.updateAppListUrl}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    authorizeFunctionListUrl:string = '/console-api/role/authorizeFunctionList';
    authorizeFunctionList(data:any) {
        return this.http
            .post(this.authorizeFunctionListUrl, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryTenantAppList(oraganization: any){
        return this.http.post(`${this.getAllAppListUrl}`, oraganization,{headers: this.headers})
        .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }


}