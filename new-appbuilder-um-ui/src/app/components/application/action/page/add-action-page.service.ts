import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class AddActionPageService {
    addActionUrl:string = '/console-api/function/save';
    getActionAttributeUrl:string = '/console-api//functionAttribute/list';
    getFunctionByIdUrl:string = '/console-api/function/getFunctionById';
    queryAppAttributeListByNameUrl:string = '/console-api/appController/queryAppAttributeListByName';

    constructor(private http: HttpClient) {

    }

    addAction(action:any) {
        return this.http.post(`${this.addActionUrl}`, action)
    }

    getActionAttribute(params:any) {
        return this.http.post(`${this.getActionAttributeUrl}`,params)

    }

    getFunctionById(data:any) {
         
        return this.http.post(`${this.getFunctionByIdUrl}`, data)
    }
    getAppAttributeListByName(data:any) {
        return this.http.post(`${this.queryAppAttributeListByNameUrl}`, data)
    }


}