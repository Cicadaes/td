import { Component, Injectable } from '@angular/core';
import {Http} from "@angular/http";
import {CRUDService} from "../../../../components/common/services/crud.service";

@Injectable()
export class CarouselAppAddDialogService extends CRUDService {
    getAppAllUrl:string = window['appConfig']['apiCode']+'/appController/queryAppLists';
    getAppUrl:string = window['appConfig']['apiCode']+'/appController/queryTenantAppList';

    getAppFunUrl:string = window['appConfig']['apiCode']+'/appController/queryFunctionListByApp';
    getTenantAppFuncUrl:string = window['appConfig']['apiCode']+'/appController/queryTenantAppFunc';


    getAllAppListUrl = window['appConfig']['apiCode']+'/appController/queryTenantAppAllList';

    // 获取appList
    queryAppList(params:any) {
        return this.http.post(`${this.getAllAppListUrl}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }

    queruAppAllList(params:any){
      return this.http.post(`${this.getAppAllUrl}`,params,{headers: this.headers})
          .toPromise()
          .then(response => response.json())
          .catch(this.handleError);
    }

    // 获取app的功能列表
    queryAppFunList(params:any, url: string = this.getAppFunUrl) {
        // return this.http.post(`${this.getAppFunUrl}`,params)
        return this.http.post(`${url}`,params,{headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);

    }


    queryTenantAppList(oraganization: any){
        return this.http.post(`${this.getAllAppListUrl}`, oraganization,{headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }

}
