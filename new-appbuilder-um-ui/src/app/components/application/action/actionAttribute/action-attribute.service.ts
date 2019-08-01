import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class ActionAttributeService {
    getActionAttributeUrl:string = '/console-api//functionAttribute/list';
    deleteActionAttributeUrl:string = '/console-api//functionAttribute/delete';
    getActionAttribute(params:any) {
       return this.http.post(`${this.getActionAttributeUrl}`,params)
        
    }
    deleteActionAttribute(params:any) {
        return this.http.post(`${this.deleteActionAttributeUrl}`,params)

    }

    constructor(private http: HttpClient) {
    }

}