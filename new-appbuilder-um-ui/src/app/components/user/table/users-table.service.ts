import {Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Headers, Http} from '@angular/http';
import {CRUDService} from "../../common/services/crud.service";

@Injectable()
export class UsersTableService extends CRUDService {

    getUsersUrl:string = '/console-api/user/queryUserList';
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