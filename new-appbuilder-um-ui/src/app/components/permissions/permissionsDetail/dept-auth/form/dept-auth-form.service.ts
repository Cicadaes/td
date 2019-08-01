import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import { CRUDService } from '../../../../common/services/crud.service';

@Injectable()
export class deptAuthFormService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    getUserGroupsUrl:string = '/console-api/userGroup/queryUserGroupsByPage';
    queryUserGroupsByPage(params:any) {
        return this.poste(this.getUserGroupsUrl, params);
    }

}