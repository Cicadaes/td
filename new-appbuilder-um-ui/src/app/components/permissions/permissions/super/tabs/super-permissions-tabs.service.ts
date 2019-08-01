import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class SuperPermissionsTabsService {
    getUsersUrl: string = '/console-api/role/queryUserWithRole/';
    getFunctionsUrl: string = '/console-api/role/queryAuthorizedFunctions/';

    getUsers(params: any) {
        return this.http.post(`${this.getUsersUrl}`, {
            params: params
        })
    }

    getFunctions(params: any) {
        return this.http.post(`${this.getFunctionsUrl}`, {
            params: params
        })
    }
    constructor(private http: HttpClient) {
    }
}