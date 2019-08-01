import { Component, Injectable } from '@angular/core';
import {Headers, Http} from '@angular/http';
import {CRUDService} from "../../../../common/services/crud.service";

@Injectable()
export class DetailFuncDialogService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    addUserUrl = window['appConfig']['apiCode']+'/user/insertOrUpdateUser';
    addUser(user:any) {
        if(user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        return this.poste(this.addUserUrl, user);
    }

    getUgUserListUrl = window['appConfig']['apiCode']+'/user/queryUserList';
    getUgUserList(user:any) {
        let pamams = {};
        if(user.id){
            pamams = {
                vid:user.id,
                vemail:user.email
            };
        } else {
            pamams = {
                vemail:user.email
            };
        }
        return this.poste(this.getUgUserListUrl, pamams);
    }
   
}