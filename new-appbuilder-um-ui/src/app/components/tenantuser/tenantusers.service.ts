import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class TenantusersService {
    getUsersUrl = '/console-api/user/queryTenantUserList';

    constructor(private http: HttpClient) {
    }
   
}