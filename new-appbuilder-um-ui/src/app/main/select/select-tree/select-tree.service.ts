import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class SelectTreeService {

    getDatas(dataUrl:string,params:any) {
        return this.http.post(`${dataUrl}`, {
            params: params
        })
    }

    constructor(private http: HttpClient) {
    }

}