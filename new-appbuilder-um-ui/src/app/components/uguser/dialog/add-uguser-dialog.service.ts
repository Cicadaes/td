import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from '../../common/services/crud.service';
import { NameService } from '../../common/services/rsa.service';
import { Http } from '@angular/http';

@Injectable()
export class AddUgUserDialogService extends CRUDService {
    addUgUserUrl = '/console-api/user/insertOrUpdateUser';
    getUgUserListUrl = '/console-api/user/queryUserList';

    constructor(public http: Http, public NameService: NameService) {
        super(http);
    }

    addUgUser(user: any) {
        if (user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        if (user && user.checkPassword && user.password) {
            user.checkPassword = this.NameService.encodersa(user.checkPassword);
            user.password = this.NameService.encodersa(user.password);
        }
        return this.poste(this.addUgUserUrl, user);
    }

    getUgUserList(user: any) {
        let pamams = {};
        if (user.id) {
            pamams = {
                vid: user.id,
                vemail: user.email
            };
        } else {
            pamams = {
                vemail: user.email
            };
        }
        return this.poste(this.getUgUserListUrl, pamams);
    }
}
