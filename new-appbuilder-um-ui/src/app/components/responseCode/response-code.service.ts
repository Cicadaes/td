import { Injectable } from '@angular/core';
import { CRUDService } from '../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class ResponseCodeService extends CRUDService {
    url: any = '/apimanager-api/meta';
    constructor(public http: Http) {
        super(http);
    }

    // 获取返回码列表
    getResponseCode(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.url}/responseCodes` + str, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    // 获取一级产品分类
    getProduct() {
        return this.http.get(`${this.url}/catalogs/all?parentId=0`, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 添加返回码
    addResponseCode(params: any) {
        return this.http.post(`${this.url}/responseCodes`, params , { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 编辑返回码
    updateResponseCode(params: any) {
        return this.http.put(`${this.url}/responseCodes`, params , { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 删除返回码
    deleteResponseCode(code: any) {
        return this.http.delete(`${this.url}/responseCodes/${code}`, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 删除返回码
    getDeleteStatus(code: any) {
        return this.http.get(`${this.url}/responseCodes/${code}/check`, {headers: this.headers})
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
}
