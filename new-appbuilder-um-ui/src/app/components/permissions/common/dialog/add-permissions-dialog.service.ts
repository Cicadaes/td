import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddPermissionsDialogService {
    addRoleUrl:string = '/console-api/role/addRole/';
    modifyRoleUrl:string = '/console-api/role/modifyRole/';

    constructor(private http: HttpClient) {

    }

    addRole(role:any) {
        return this.http.post(`${this.addRoleUrl}`, {
            params: role
        })
    }
    modifyRole(role:any) {
        return this.http.post(`${this.modifyRoleUrl}`, {
            params: role
        })
    }
}