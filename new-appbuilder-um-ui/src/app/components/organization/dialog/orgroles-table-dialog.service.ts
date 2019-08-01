import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class OrgRolesTableDialogService extends CRUDService {

    addUgRoleUrl = window['appConfig']['apiCode']+'/role/authorizeRole';
    addUgRole(roleRelation:any) {
        return this.poste(this.addUgRoleUrl, roleRelation);
    }

    constructor(public http: Http) {
        super(http);
    }
   
}