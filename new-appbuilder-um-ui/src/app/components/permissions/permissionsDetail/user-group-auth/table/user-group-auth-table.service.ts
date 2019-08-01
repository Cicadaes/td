import { Injectable } from '@angular/core';
import { CRUDService } from '../../../../common/services/crud.service';
import { Http } from "@angular/http";

@Injectable()
export class UserGroupAuthTableService extends CRUDService {
    queryAuthUserGroupUrl: string = '/dataauth/dataauth/adminAuths/getAdminAuth'; // 管理员操作权限查询接口
    deleteUserGroupRoleRELUrl: string = '/console-api/virtualroleRoleRel/deleteUserGroupRoleREL';
    queryUserGroupUrl: string = '/console-api/virtualroleRoleRel/queryUserGroupListNoInRoleId';
    batchDeletingUserGroupRoleRELUrl: string = '/console-api/virtualroleRoleRel/batchDeletingUserGroupRoleREL';
    editAdminAuthsUrl: string = '/dataauth/dataauth/adminAuths';

    constructor(public http: Http) {
        super(http);
    }

    getAuthUserGroup(params: any) {
        return this.http.post(`${this.queryAuthUserGroupUrl}`, params).toPromise()
            .then(response => response.json())
            .catch(this.handleError)
    }
    editAdminAuths(params: any) {
        return this.http.put(`${this.editAdminAuthsUrl}`, params).toPromise()
            .then(response => response.json())
            .catch(this.handleError)
    }

    getUserGroupList(params: any) {
        return this.http.post(`${this.queryUserGroupUrl}`, params).toPromise()
            .then(response => response.json())
            .catch(this.handleError)
    }
    deleteUserGroupRoleREL(params: any) {
        return this.http.post(`${this.deleteUserGroupRoleRELUrl}`, params).toPromise()
            .then(response => response.json())
            .catch(this.handleError)
    }

    batchDeletingUserGroupRoleREL(params: any) {
        return this.http.post(`${this.batchDeletingUserGroupRoleRELUrl}`, params).toPromise()
            .then(response => response.json())
            .catch(this.handleError)
    }

}