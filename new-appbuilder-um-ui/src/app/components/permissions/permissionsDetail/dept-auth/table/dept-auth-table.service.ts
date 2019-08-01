import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CRUDService } from '../../../../common/services/crud.service';

@Injectable()
export class DeptAuthTableService extends CRUDService {
    queryDeptUrl: string = '/dataauth/dataauth/roleHierarchies/rows';
    queryDept(targetId: any, tenantId: any, page: number, size: number) {
        return this.http.get(`${this.queryDeptUrl}` + '?targetId=' + targetId + '&tenantId=' + tenantId + '&pageSize=' +size+ '&page='+page)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    deleteUrl: string = '/dataauth/dataauth/roleHierarchies/';
    deleteRoleLevel(params: any) {
        return this.http.delete(`${this.deleteUrl}` + params)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
    constructor(public http: Http) {
        super(http);
    }
}