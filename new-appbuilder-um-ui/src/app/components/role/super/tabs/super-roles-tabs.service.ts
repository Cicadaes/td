import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class SuperRolesTabsService {
    getUsersUrl = '/console-api/role/queryUserWithRole/';
    getFunctionsUrl = '/console-api/role/queryAuthorizedFunctions/';

    getUsers(params: any) {
        return this.http.post(`${this.getUsersUrl}`, {
            params: params
        });
    }

    getFunctions(params: any) {
        return this.http.post(`${this.getFunctionsUrl}`, {
            params: params
        });
    }
    constructor(private http: HttpClient) {
    }
}
