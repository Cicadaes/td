import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../../../../common/services/crud.service";
import {Http} from "@angular/http";
@Injectable()
export class FuncAuthCheckTreeService extends CRUDService{

    querySuperRoleFuncType(roleFunc:any) {
        let querySuperRoleFuncTypeUrl = '/console-api/role/querySuperRoleFuncType';
        return this.http
            .post(querySuperRoleFuncTypeUrl, JSON.stringify(roleFunc), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    querySuperRoleFunc(roleFunc:any) {
        let querySuperRoleFuncUrl = '/console-api/role/querySuperRoleFunc';
        return this.http
            .post(querySuperRoleFuncUrl, JSON.stringify(roleFunc), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }
}