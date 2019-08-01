import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class FunctionTableService {
    queryFunctonUrl:string = '/console-api/function/list';
    deleteActionsUrl:string = '/console-api/function/delete';

    queryFunctions(params:any) {
        return this.http.post(`${this.queryFunctonUrl}`, params)
    }

    deleteAction(params:any) {
        return this.http.post(`${this.deleteActionsUrl}`,  params)
    }

    constructor(private http: HttpClient) {
    }

}