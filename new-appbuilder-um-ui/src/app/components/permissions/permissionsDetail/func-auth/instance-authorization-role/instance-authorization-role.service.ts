import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/components/common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class InstanceAuthorizationRoleService extends CRUDService {

    constructor(
        public http: Http
    ) {
        super(http);
        this.baseUrl = "";
        this.saveRouter = "dataauth/dataauth/targetDetailAuths";
        this.updateRouter = "dataauth/dataauth/targetDetailAuths";
    }

    /**
     * 获取角色设置对左侧所选数据对象实例的操作权限 列表
     * @param param 
     */
    getInstanceAuthRoleList(param: any) {
        let url = `/dataauth/dataauth/targetDetailAuths/queryRowsByRoleName?`;
        url += this.getParams(param);
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 查看明细授权角色权限
     * @param param 
     */
    getRolePermissionByInstanceId(param: any) {
        let url = `/dataauth/dataauth/targetDetailAuths/findDetailAuth?`;
        url += this.getParams(param);
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    /**
     * 通过数据对象实例ID过滤当前租户管理员下的角色
     * @param param 
     */
    getRoleListByInstanceId(param: any) {
        let url = `/dataauth/dataauth/console/targetInstanceRoles?`;
        url += this.getParams(param);
        return this.http.post(url, null, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 删除实例角色权限
     * @param roleIds 
     * @param targetId 
     * @param targetInstanceId 
     */
    deleteInstanceRolePermission(roleIds: any, targetId: string, targetInstanceId: any): any {
        let url = `/dataauth/dataauth/targetDetailAuths/batchDelete?roleIds=${roleIds}&targetId=${targetId}&targetInstanceId=${targetInstanceId}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}
