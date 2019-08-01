import { Component, Injectable } from '@angular/core';
import {CRUDService} from "../../common/services/crud.service";
import {Http} from "@angular/http";

@Injectable()
export class TenantDetailService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }

    queryTenantById = '/console-api/tenant/queryTenantById';
    getTenantDetailById(id: number){
        let params = {id:id};
        return this.poste(this.queryTenantById, params);
    }
   
}