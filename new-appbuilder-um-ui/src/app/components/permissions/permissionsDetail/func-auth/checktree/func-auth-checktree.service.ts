import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { CRUDService } from '../../../../common/services/crud.service';
@Injectable()
export class funcAuthChecktreeService extends CRUDService {
    queryFunctonUrl: string = '/dataauth/dataauth/targetDetailAuths/queryRestDetail';
    deleteActionsUrl: string = '/dataauth/dataauth/roleHierarchyItems/';
    moveUrl: string = '/dataauth/dataauth/roleHierarchyItems/move';

    queryFunctions(page: number, pagesize: number, targetId: any, tenantId: any) { // 搜索树的列表
        return this.http.get(`${this.queryFunctonUrl}` + '?page=' + page + '&pagesize=' + pagesize + '&targetId=' + targetId + '&tenantId=' + tenantId)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }

}