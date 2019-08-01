import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CRUDService } from '../../../../components/common/services/crud.service';

@Injectable()
export class CarouselAppAddDialogService extends CRUDService {
    getAppUrl = '/console-api/appController/queryAppLists';
    getAppFunUrl = '/console-api/appController/queryFunctionListByApp';
    queryAppList(params: any) {
        return this.http.post(`${this.getAppUrl}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    queryAppFunList(params: any) {
        return this.http.post(`${this.getAppFunUrl}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    queryApp(url: string, params: any) {
        return this.http.post(`${url}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    queryAppFun(url: string, params: any) {
        return this.http.post(`${url}`, params)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }
    constructor(public http: Http) {
        super(http);
    }

}