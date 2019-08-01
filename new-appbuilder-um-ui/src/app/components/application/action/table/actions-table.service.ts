import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class ActionsTableService {
    getActionsUrl:string = '/console-api/function/list';
    deleteActionsUrl:string = '/console-api/function/delete';

    getActions(params:any) {
       return this.http.post(`${this.getActionsUrl}`,  params)
    }

    deleteAction(params:any) {
        return this.http.post(`${this.deleteActionsUrl}`,  params)
    }

    constructor(private http: HttpClient) {
    }

}