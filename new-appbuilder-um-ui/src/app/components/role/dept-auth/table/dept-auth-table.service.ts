import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class DeptAuthTableService {
    queryDeptUrl:string = '/console-api/role/queryAuthorizedOrg';
    queryDept(params:any) {
        return this.http.post(`${this.queryDeptUrl}`, params)
    }

    constructor(private http: HttpClient) {
    }
}