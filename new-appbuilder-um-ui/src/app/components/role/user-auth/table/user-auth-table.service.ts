import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class UserAuthTableService {
    queryAuthUserUrl:string = '/console-api/role/queryAuthorizedUsers';


    constructor(private http: HttpClient) {
    }

    getAuthUser(params:any) {
        return this.http.post(`${this.queryAuthUserUrl}`, params)
    }
}