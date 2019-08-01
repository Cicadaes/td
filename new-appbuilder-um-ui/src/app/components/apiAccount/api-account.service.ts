import { Injectable } from '@angular/core';
import { CRUDService } from '../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class ApiAccountService extends CRUDService {

    baseUrl = '/apimanager-api/meta/accounts';
    serviceUrl = '/apimanager-api/meta/metas/service';
    tenantUrl = '/console-api/tenant/queryTenantList';
    apiUrl = '/apimanager-api/meta/authorizations';

    // 单一移除授权过的api
    getApiDoc() {
        return this.http.get(`${this.baseUrl}/apiDocUrl`)
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
    }

    // 获取API账号列表
    getAccountsList(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}` + str)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取API账号详情
    getAccountsDetail(id: any) {
        return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 添加API账号
    addAccounts(params: any) {
        return this.http.post(`${this.baseUrl}`, params, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 编辑API账号
    updateAccounts(parmas: any) {
        return this.http.put(`${this.baseUrl}`, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 删除API账号
    deleteAccounts(id: any) {
        return this.http.delete(`${this.baseUrl}/${id}`)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取所属服务
    getService(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.serviceUrl}` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取一级产品分类
    getProduct() {
        return this.http.get(`/apimanager-api/meta/catalogs/all?parentId=0`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取租户列表
    getTenantList(params: any) {
        return this.http.post(`${this.tenantUrl}`, params, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**     授权API账号    */
    // 获取已经授权的API列表
    getApiLIst(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.apiUrl}` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getUnApiLIst(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.apiUrl}/unauthorized` + str, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 批量授权api
    insertAllApi(parmas: any, accountId: any) {
        return this.http.post(`${this.apiUrl}?accountId=${accountId}`, parmas, { headers: this.headers })
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
    }

    // 批量删除Api接口的授权
    deleteAllApi(idList: any) {
        return this.http.delete(`${this.apiUrl}/batchDelete?idList=${idList}`)
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
    }

    // 单一移除授权过的api
    deleteApi(id: any) {
        return this.http.delete(`${this.apiUrl}/${id}`)
        .toPromise()
        .then(response => response.json())
        .catch(this.handleError);
    }

    getParams(params: any): string {
        const arr = [];
        for (const name in params) {
            if (true) {
                arr.push(name + '=' + params[name]);
            }
        }
        return '?' + arr.join('&');
    }

    constructor(public http: Http) {
        super(http);
    }
}
