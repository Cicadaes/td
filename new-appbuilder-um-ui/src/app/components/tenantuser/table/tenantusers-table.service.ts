import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class TenantUsersTableService extends CRUDService {
    getUsersUrl:string = '/console-api/user/queryTenantUserList';
    getUsers(params:any) {
        return this.poste(this.getUsersUrl, params);
    }

    queryRoleByUserUrl:string = '/console-api/user/queryRoleByUser';
    queryRoleByUser(params:any) {
        return this.poste(this.queryRoleByUserUrl, params);
    }

    constructor(public http: Http) {
        super(http);
    }

}