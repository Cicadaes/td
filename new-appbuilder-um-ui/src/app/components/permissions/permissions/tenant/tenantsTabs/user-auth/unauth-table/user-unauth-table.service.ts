import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class UserUnauthTableService {
    queryAuthUserUrl: string = '/console-api/role/queryAuthorizedUsers';

    constructor(private http: HttpClient) {
    }

    getAuthUser(params: any) {
        return this.http.post(`${this.queryAuthUserUrl}`, params)
    }
}