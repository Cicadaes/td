import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { CRUDService } from '../../../../common/services/crud.service';
@Injectable()
export class TenantsPermissionsTabsService extends CRUDService{
    getUsersUrl:string = '/console-api/role/queryUserWithRole/';
    getFunctionsUrl:string = '/console-api/role/queryAuthorizedFunctions/';
    getOrgsUrl:string = '/console-api/role/queryOrgWithRole/';
    getUserGroupsUrl:string = '/console-api/role/queryUserGroupWithRole/';

    getUsers(params:any) {
       return this.http.post(`${this.getUsersUrl}`, {
            params: params
        })
    }

    getFunctions(params:any) {
        return this.http.post(`${this.getFunctionsUrl}`, {
             params: params
         })
     }

    getOrgs(params:any) {
        return this.http.post(`${this.getOrgsUrl}`, {
             params: params
         })
    }
    getUserGroups(params:any) {
        return this.http.post(`${this.getUserGroupsUrl}`, {
             params: params
         })
     }

    queryAppListByRoleIdUrl:string = '/console-api/role/queryAppListByRoleId';
    queryAppListByRoleId(data:any) {
        return this.http
            .post(this.queryAppListByRoleIdUrl, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }
}