import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class TenantRolesTableService {
    getRolesUrl:string = '/console-api/role/queryRoles/';

    addRoleUrl:string = '/console-api/role/addRole/';


    addRole(role:any) {
        return this.http.post(`${this.addRoleUrl}`, {
            params: role
        })
    }
    getTenantRoles(params:any) {
       return this.http.post(`${this.getRolesUrl}`, {
            params: params
        })
    }

    constructor(private http: HttpClient) {
    }

}