import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {CRUDService} from '../../common/services/crud.service';
import {Http} from '@angular/http';

@Injectable()
export class UgUsersTableDialogService extends CRUDService {
    addUgUserUrl = '/console-api/user/addUsersForUserGroup';

    constructor(public http: Http) {
        super(http);
    }

    addUgUser(user: any) {
        return this.poste(this.addUgUserUrl, user);
    }
}
