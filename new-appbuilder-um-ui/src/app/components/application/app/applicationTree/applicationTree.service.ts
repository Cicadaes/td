import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class applicationTreeService {
    queryFunctonUrl:string = '/console-api/function/list';
    deleteActionsUrl:string = '/console-api/function/delete';
    moveUrl:string = '/console-api/function/moveFunction';

    queryFunctions(params:any) {//搜索树的列表
         
        return this.http.post(`${this.queryFunctonUrl}`, params)
    }

    deleteAction(params:any) {
        return this.http.post(`${this.deleteActionsUrl}`,  params)
    }

    moveNode(params:any){
         
        return this.http.post(`${this.moveUrl}`,  params);
    }
    constructor(private http: HttpClient) {
    }

}