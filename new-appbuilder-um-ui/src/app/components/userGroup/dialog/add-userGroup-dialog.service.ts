import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';

@Injectable()
export class AddUserGroupDialogService extends CRUDService {
    addUserGroupUrl = '/console-api/userGroup/insertOrUpdateUserGroup';

    constructor(public http: Http) {
        super(http);
    }

    addUserGroup(userGroup: any) {
        return this.poste(this.addUserGroupUrl, userGroup);
    }
}
