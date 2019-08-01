import { Injectable } from '@angular/core';
import { CRUDService } from 'src/app/components/common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class RolePermissionService extends CRUDService {

    constructor(
        public http: Http,
    ) {
        super(http);
        this.baseUrl = '';
        this.queryRouter = "dataauth/dataauth/targetRoleAuthRels/queryRowsByRoleName";
        this.saveRouter = "dataauth/dataauth/targetRoleAuthRels";
        this.updateRouter = "dataauth/dataauth/targetRoleAuthRels";
    }

    /**
     * 通过数据对象ID过滤当前租户管理员下的角色
     * @param param 
     */
    getRolesFilterTenantId(param = { targetId: '', tenantId: '', }) {
        let url = '/dataauth/dataauth/console/targetRoles?';
        url += this.getParams(param);
        return this.http.post(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 查看角色权限
     * @param roleId 
     * @param targetId 
     */
    getRolePermission(roleId: any, targetId: any) {
        let url = `/dataauth/dataauth/targetRoleAuthRels/${targetId}/${roleId}`;
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 删除角色权限
     * @param roleIds 
     * @param targetId 
     */
    deleteRolePermission(roleIds: any, targetId: string): any {
        let url = `/dataauth/dataauth/targetRoleAuthRels?roleIds=${roleIds}&targetId=${targetId}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}
