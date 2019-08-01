import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Http } from "@angular/http";
import { CRUDService } from "../common/services/crud.service";
import { NameService } from "../common/services/rsa.service";

@Injectable()
export class RolesService extends CRUDService {

    user: any = {};
    getUser(): Promise<any> {
        if (window['appConfig'] && window['appConfig'].user) {
            this.user = window['appConfig'].user;
        }
        return Promise.resolve(this.user);
    }

    rolecode: any = {};
    getRoleCode(): Promise<any> {
        if (window['appConfig'] && window['appConfig'].rolecode) {
            this.rolecode = window['appConfig'].rolecode;
        }
        return Promise.resolve(this.rolecode);
    }

    addRoleUrl: string = '/console-api/role/addRole/';
    addRole(role: any) {
        return this.http
            .post(this.addRoleUrl, JSON.stringify(role), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    modifyRoleUrl: string = '/console-api/role/modifyRole/';
    modifyRole(role: any) {
        return this.http
            .post(this.modifyRoleUrl, JSON.stringify(role), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    existsRoleUrl: string = '/console-api/role/exists/';
    existsRole(role: any) {
        return this.http
            .post(this.existsRoleUrl, JSON.stringify(role), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getRoleByIdUrl: string = '/console-api/role/getRoleById/';
    getRoleById(roleId: number) {
        let param: any = { roleId: roleId };
        return this.http
            .post(this.getRoleByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    isSuperUrl: string = '/console-api/role/isSuperAdmin/';
    isSuper(userId: number) {
        let param: any = { userId: userId };
        return this.http
            .post(this.getRoleByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getSuperRolesUrl: string = '/console-api/role/getSuperRoles/';
    getSuperRoles() {
        return this.http.post(this.getSuperRolesUrl, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryTenantRolesByPageUrl: string = '/console-api/role/queryTenantRolesByPage/';
    queryTenantRolesByPage(role: any) {
        return this.http
            .post(this.queryTenantRolesByPageUrl, JSON.stringify(role), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    queryRoleUserByPageUrl: string = '/console-api/role/queryUserByPage/';
    queryRoleUserByPage(roleUser: any) {
        return this.http
            .post(this.queryRoleUserByPageUrl, JSON.stringify(roleUser), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    queryUnauthUserByPageUrl: string = '/console-api/role/queryUnauthUserByPage/';
    queryUnauthUserByPage(roleUser: any) {
        return this.http
            .post(this.queryUnauthUserByPageUrl, JSON.stringify(roleUser), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    authorizeUser(userAuth: any) {
        let authUserUrl = '/console-api/role/authorizeUser';
        return this.http
            .post(authUserUrl, JSON.stringify(userAuth), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    batchAuthorizeUser(userAuthSet: any) {
        let batchAuthUserUrl = '/console-api/role/batchAuthorizeUser';
        return this.http
            .post(batchAuthUserUrl, JSON.stringify(userAuthSet), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    updateTenantUser(parmas: any) {
        let batchAuthUserUrl = '/console-api/role/replaceTenantAdmin';
        return this.http
            .post(batchAuthUserUrl, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    revokeUserById(authId: any) {
        let revokeUserByIdUrl = '/console-api/role/revokeUserById';
        return this.http
            .post(revokeUserByIdUrl, JSON.stringify({ authId: authId }), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    revokeUser(userAuth: any) {
        let revokeUserUrl = '/console-api/role/revokeUser';
        return this.http
            .post(revokeUserUrl, JSON.stringify(userAuth), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    batchRevokeUser(authIdList: any) {
        let batchRevokeUserUrl = '/console-api/role/batchRevokeUser';
        return this.http
            .post(batchRevokeUserUrl, JSON.stringify(authIdList), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // User

    getUserById(id: number) {
        let getUserByIdUrl: string = '/console-api/user/queryUserById/';
        let param: any = { id: id };
        return this.http
            .post(getUserByIdUrl, JSON.stringify(param), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    addUser(user: any) {
        let addUserUrl = '/console-api/user/insertOrUpdateUser';
        if (user.status) {
            user.status = 1;
        } else {
            user.status = 0;
        }
        if (user && user.checkPassword && user.password) {
            user.checkPassword = this.NameService.encodersa(user.checkPassword);
            user.password = this.NameService.encodersa(user.password);
        }
        return this.http
            .post(addUserUrl, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    checkRolseName(userAuthSet: any) {
        let batchNameUrl = '/console-api/role/checkRole';
        return this.http
            .post(batchNameUrl, userAuthSet)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    constructor(public http: Http, public NameService: NameService) {
        super(http);
    }
}