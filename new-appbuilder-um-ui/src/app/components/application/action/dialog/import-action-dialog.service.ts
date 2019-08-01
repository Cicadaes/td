import { Component, Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import { filter } from 'rxjs/operators/filter';

@Injectable()
export class ImportActionDialogService {
    importActionUrl:string = '/console-api/function/import';

    constructor(private http: HttpClient) {

    }

    importAction(action:any) {
        return this.http.post(`${this.importActionUrl}`, action)
    }

    handleUpload(formData:any,appId:string) {
        const _parmas = new HttpParams();
        _parmas.append('appId',"94");
        var parmass = '?appId='+appId;
        const req = new HttpRequest('POST', `${this.importActionUrl}`+parmass,formData);
        return this.http.request(req).pipe(filter(e => e instanceof HttpResponse));
    }

}