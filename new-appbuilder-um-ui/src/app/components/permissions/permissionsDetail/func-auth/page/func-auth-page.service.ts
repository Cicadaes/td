import { Injectable } from '@angular/core';
import { CRUDService } from '../../../../common/services/crud.service';
import { Http } from "@angular/http";


@Injectable()
export class funcAuthPageService extends CRUDService {
    getRoleList: string = '/console-api/role/queryTenantRolesByPage/';
    saveRoleUrl: string = '/dataauth/dataauth/targetDetailAuths/authorize';
    queryNodeInfoUrl: string = '/dataauth/dataauth/targetDetailAuths/getTargetDetailAuth'; // 点击节点查询对应角色层级数据

    constructor(public http: Http) {
        super(http);
    }

    getRole(params: any) { // 获取角色下拉列表
        return this.http.post(`${this.getRoleList}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    saveRole(params: any) {
        return this.http.post(`${this.saveRoleUrl}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // 点击查询树节点右侧数据
    queryNodeInfo(data: any) {
        return this.http.post(`${this.queryNodeInfoUrl}`, data)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


}