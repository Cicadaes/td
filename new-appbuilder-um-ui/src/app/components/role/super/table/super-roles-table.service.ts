import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class SuperRolesTableService {
    //getRolesUrl:string = '/console-api/role/queryRoles';
    getRolesUrl:string = '/console-api/role/queryRolesByPage';
    getRoles(params:any) {
       return this.http.post(`${this.getRolesUrl}`, {
            params: params
        })
    }

    constructor(private http: HttpClient) {
    }
}