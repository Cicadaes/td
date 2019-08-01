import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ExportActionDialogService {
    addActionUrl:string = '/console-api/function/save';
    queryFunctionsUrl:string = '/console-api/function/NoPagelist';
    exportFunctionsUrl:string = '/console-api/function/export';

    constructor(private http: HttpClient) {

    }

    addAction(action:any) {
        return this.http.post(`${this.addActionUrl}`, action)
    }

    queryFunctions(params:any) {
        return this.http.post(`${this.queryFunctionsUrl}`,params)

    }

    exportFunctions(params:any) {
        //return this.http.get(`${this.exportFunctionsUrl}`+"?ids="+ids,{responseType: 'blob'})
        return this.http.post(`${this.exportFunctionsUrl}`,params)
    }

}