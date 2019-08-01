import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CRUDService } from '../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class DomainNameService extends CRUDService {

    // 获取一级产品分类
    getProductUrl = '/apimanager-api/meta/catalogs/all';
    domainUrl = '/apimanager-api/meta/domains';

    getProduct() {
        return this.http.get(`${this.getProductUrl}?parentId=0`, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取返回码列表
    getDomainName(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.domainUrl}` + str, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    // 添加
    addDomainName(params: any) {
        return this.http.post(`${this.domainUrl}`, params , { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 编辑
    updateDomainName(params: any) {
        return this.http.put(`${this.domainUrl}`, params , { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 删除
    deleteDomainName(name: any) {
        return this.http.delete(`${this.domainUrl}/${name}`, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

     // 删除返回码
     getDeleteStatus(name: any) {
        return this.http.get(`${this.domainUrl}/${name}/check`, {headers: this.headers})
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
