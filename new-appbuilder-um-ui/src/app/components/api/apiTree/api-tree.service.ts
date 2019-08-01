import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CRUDService } from '../../common/services/crud.service';
import { Http } from '@angular/http';

@Injectable()
export class ApiTreeService extends CRUDService {
    constructor(public http: Http) {
        super(http);
    }

    // 获取产品级联列表
    getProductList() {
        return this.http.get('/apimanager-api/meta/catalogs/cascade', {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}
