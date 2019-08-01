import {  Injectable } from '@angular/core';
import { CRUDService } from '../../../common/services/crud.service';
import { Http } from "@angular/http";

@Injectable()
export class DeptAuthService extends CRUDService {
    getDeptAuthUrl = '/console-api/virtualroleRoleRel/queryAuthorizedOrg';
    saveOrganizationUrl = '/console-api/virtualroleRoleRel/saveOrganization';
    queryFunctonUrl: string = '/dataauth/dataauth/roleHierarchyItems/getTree';
    // 添加角色层级完成时，先获取列表
    queryDeptUrl: string = '/dataauth/dataauth/roleHierarchies/rows';
    queryDept(targetId: any, tenantId: any, page: number, size: number) {
        return this.http.get(`${this.queryDeptUrl}` + '?targetId=' + targetId + '&tenantId=' + tenantId + '&pageSize=' +size+ '&page='+page)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    queryFunctions(roleHierarchyId: any, tenantId: number) { // 搜索树的列表
        return this.http.get(`${this.queryFunctonUrl}` + '?roleHierarchyId=' + roleHierarchyId + '&tenantId=' + tenantId)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }

    getDeptAuth(data:any) {
        return this.http.post(`${this.getDeptAuthUrl}`, data)
    }

    saveOrganization(data:any) {
        return this.http.post(`${this.saveOrganizationUrl}`, data)
    }
}
