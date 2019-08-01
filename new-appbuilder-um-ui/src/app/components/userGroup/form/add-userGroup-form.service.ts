import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class AddUserGroupFormService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    getUserGroupsUrl:string = '/console-api/userGroup/queryUserGroupsByPage';
    queryUserGroupsByPage(params:any) {
        return this.poste(this.getUserGroupsUrl, params);
    }

}