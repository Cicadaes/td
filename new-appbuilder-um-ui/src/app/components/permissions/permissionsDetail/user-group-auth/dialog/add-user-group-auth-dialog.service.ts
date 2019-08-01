import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddUserGroupAuthDialogService {
    saveVirtualroleRoleRelUrl = '/console-api/virtualroleRoleRel/save';
    revokeUserUrl = '/console-api/role/revokeUser';

    constructor(private http: HttpClient) {
    }

    saveVirtualroleRoleRel(roleId: any) {
        return this.http.post(`${this.saveVirtualroleRoleRelUrl}`, roleId)
    }

    revokeUser(userAuth: any) {
        return this.http.post(`${this.revokeUserUrl}`, userAuth.id)
    }
}