import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from "../../../components/common/services/crud.service";
import { Http } from "@angular/http";


@Injectable()
export class CarouselAppManageService extends CRUDService {


  constructor(public http: Http) {
    super(http);
  }

  getRoleByIdUrl: string = '/console-api/role/getRoleById/';
  getAppListUrl=window['appConfig']['apiCode']+"/licenceController/queryAppListByLicence";

  getRoleById(roleId: number) {
    let param: any = { roleId: roleId };
    return this.http
      .post(this.getRoleByIdUrl, JSON.stringify(param), { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  queryAppListByRoleId(data:any) {
      let queryAppListByRoleIdUrl:string = '/console-api/role/queryAppListByRoleId';
      return this.http
          .post(queryAppListByRoleIdUrl, JSON.stringify(data), {headers: this.headers})
          .toPromise()
          .then(response => response.json())
          .catch(this.handleError);
  }

  queryLicencesAppList(params:any) {
      return this.http.post(`${this.getAppListUrl}`,params,{headers: this.headers})
          .toPromise()
          .then(response => response.json())
          .catch(this.handleError);

  }

  getTenantAppListUrl="/console-api/userGroup/queryAppListByUser";
  queryAppListByUser(params:any) {
      return this.poste(this.getTenantAppListUrl, params);
  }

}
