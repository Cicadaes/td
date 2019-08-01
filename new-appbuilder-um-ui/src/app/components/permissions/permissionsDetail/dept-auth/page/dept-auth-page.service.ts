import { Injectable } from '@angular/core';
import { CRUDService } from '../../../../common/services/crud.service';
import { Http } from "@angular/http";

@Injectable()
export class deptAuthPageService extends CRUDService {
    addActionUrl: string = '/console-api/function/save';
    getActionAttributeUrl: string = '/console-api//functionAttribute/list';
    getFunctionByIdUrl: string = '/console-api/function/getFunctionById';
    queryAppAttributeListByNameUrl: string = '/console-api/appController/queryAppAttributeListByName';
    getRoleList: string = '/console-api/role/queryTenantRolesByPage/';
    addRoleLevelUrl: string = '/dataauth/dataauth/roleHierarchyItems';
    editRoleLevelUrl: string = '/dataauth/dataauth/roleHierarchyItems';
    constructor(public http: Http) {
        super(http);
    }

    getRole(params: any) { // 获取角色下拉列表
        return this.http.post(`${this.getRoleList}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // 新增角色层级
    addRoleLevel(params: any) {
        return this.http.post(`${this.addRoleLevelUrl}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // 修改角色层级
    editRoleLevel(params: any) {
        return this.http.put(`${this.editRoleLevelUrl}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    addAction(action: any) {
        return this.http.post(`${this.addActionUrl}`, action)
    }

    getActionAttribute(params: any) {
        return this.http.post(`${this.getActionAttributeUrl}`, params)

    }

    getFunctionById(data: any) {

        return this.http.post(`${this.getFunctionByIdUrl}`, data)
    }
    getAppAttributeListByName(data: any) {
        return this.http.post(`${this.queryAppAttributeListByNameUrl}`, data)
    }


}