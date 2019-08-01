import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';

@Injectable()
export class UgRolesTableDialogService extends CRUDService {

    addUgRoleUrl = '/console-api/role/authorizeUser';
    saveVirtualroleRoleRelUrl = '/console-api/virtualroleRoleRel/save';

    addUgRole(roleRelation: any) {
        return this.poste(this.addUgRoleUrl, roleRelation);
    }

    saveVirtualroleRoleRel(roleId: any) {
        return this.http.post(`${this.saveVirtualroleRoleRelUrl}`, roleId);
    }

    constructor(public http: Http) {
        super(http);
    }




}
