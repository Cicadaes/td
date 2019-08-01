import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from "../../common/services/crud.service";
import { NameService } from "../../common/services/rsa.service";
import { Http } from "@angular/http";

@Injectable()
export class AddTenantuserPageService extends CRUDService {

    constructor(public http: Http, public NameService: NameService) {
        super(http);
    }

    addUserUrl = '/console-api/user/insertOrUpdateUser';
    addUser(user: any) {
        if (user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        if (user && user.checkPassword && user.password) {
            user.checkPassword = this.NameService.encodersa(user.checkPassword);
            user.password = this.NameService.encodersa(user.password);
        }
        return this.poste(this.addUserUrl, user);
    }

    getUgUserByIdUrl = '/console-api/user/queryUserById';
    getUgUserById(id: number) {
        let pamams = { id: id };
        return this.poste(this.getUgUserByIdUrl, pamams);
    }

    getUgUserListUrl = '/console-api/user/queryUserList';
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

    getOrgUrl = '/console-api/user/queryOrgByUser';
    queryOrganization(params: any) {
        return this.poste(this.getOrgUrl, params);
    }

    queryOrgByIdUrl = '/console-api/organizationController/queryOrganizationById';
    queryOrgById(id: any) {
        return this.poste(this.queryOrgByIdUrl, { id: id });
    }

}