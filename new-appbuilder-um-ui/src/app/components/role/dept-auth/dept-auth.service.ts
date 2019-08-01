import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class DeptAuthService {
    getDeptAuthUrl = '/console-api/virtualroleRoleRel/queryAuthorizedOrg';
    saveOrganizationUrl = '/console-api/virtualroleRoleRel/saveOrganization';

    constructor(private http: HttpClient) {

    }

    getDeptAuth(data:any) {
        return this.http.post(`${this.getDeptAuthUrl}`, data)
    }

    saveOrganization(data:any) {
        return this.http.post(`${this.saveOrganizationUrl}`, data)
    }
}
