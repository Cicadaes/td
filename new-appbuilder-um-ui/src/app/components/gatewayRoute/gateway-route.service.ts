import { Injectable } from '@angular/core';
import { CRUDService } from '../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class GatewayRouteervice extends CRUDService {

    baseUrl = '/apimanager-api/meta/routingRules';
    serviceUrl = '/apimanager-api/meta/services';

    // 获取路由网管列表
    getWayRouteList(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}` + str)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 获取路由网管列表
    getWayRouteDetail(id: any) {
        return this.http.get(`${this.baseUrl}/${id}`, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 添加
    addWayRoute(params: any) {
        return this.http.post(`${this.baseUrl}`, params, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }


    // 编辑
    updateWayRoute(parmas: any) {
        return this.http.put(`${this.baseUrl}`, parmas, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    // 删除
    deletegWayRoute(id: any) {
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
