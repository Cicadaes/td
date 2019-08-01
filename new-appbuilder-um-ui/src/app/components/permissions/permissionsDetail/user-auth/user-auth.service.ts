import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserAuthService {

    getUserAuthUrl: string = '/console-api/role/queryUserWithRole/';

    getUserAuth(params: any) {
        return this.http.post(`${this.getUserAuthUrl}`, {
            params: params
        })
    }

    constructor(private http: HttpClient) {
    }
}