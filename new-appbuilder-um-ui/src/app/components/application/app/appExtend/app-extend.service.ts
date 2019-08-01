import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class AppExtendService {
    getAppAttributeUrl:string = window['appConfig']['apiCode']+'/appController/getAppAttributeByApp';
    deleteAppAttributeUrl:string = window['appConfig']['apiCode']+'/appController/deleteAppAttribute';
    getAttribute(params:any) {
       return this.http.post(`${this.getAppAttributeUrl}`,params)
        
    }
    deleteAppAttribute(params:any) {
        return this.http.post(`${this.deleteAppAttributeUrl}`,params)

    }

    /*getAppAttributeByAppId(id: number){
        let params = {
            id:id
        };
        return this.http.post(`${this.getAppAttributeUrl}`, {
            params: params
        });
    }*/

    constructor(private http: HttpClient) {
    }

}