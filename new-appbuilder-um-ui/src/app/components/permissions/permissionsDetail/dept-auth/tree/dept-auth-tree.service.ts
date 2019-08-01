import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CRUDService } from '../../../../common/services/crud.service';
@Injectable()
export class deptAuthTreeService extends CRUDService {
    queryFunctonUrl: string = '/dataauth/dataauth/roleHierarchyItems/getTree';
    deleteActionsUrl: string = '/dataauth/dataauth/roleHierarchyItems/';
    moveUrl: string = '/dataauth/dataauth/roleHierarchyItems/move';
    queryNodeInfoUrl: string = '/dataauth/dataauth/roleHierarchyItems/'; // 点击节点查询对应角色层级数据

    queryFunctions(roleHierarchyId: any, tenantId: number) { // 搜索树的列表

        return this.http.get(`${this.queryFunctonUrl}` + '?roleHierarchyId=' + roleHierarchyId + '&tenantId=' + tenantId)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    // 点击查询树节点右侧数据
    queryNodeInfo(data: any) {
        return this.http.get(`${this.queryNodeInfoUrl}` + data)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    deleteAction(params: any) {
        return this.http.delete(`${this.deleteActionsUrl}` + params).toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    moveNode(params: any) {

        return this.http.post(`${this.moveUrl}`, params).toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    constructor(public http: Http) {
        super(http);
    }

}