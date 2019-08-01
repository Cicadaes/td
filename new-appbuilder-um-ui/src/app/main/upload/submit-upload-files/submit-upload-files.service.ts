import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {SubmitUploadFilesComponent} from "./submit-upload-files.component";
@Injectable()
export class SubmitUploadFilesService {

    getTableDatas(ajaxUrl:string,pageIndex = 1, pageSize = 10, sortField: any, sortOrder: any,tableFileds:any) {//, genders: any
        let params = new HttpParams()
            .append('page', `${pageIndex}`)
            .append('results', `${pageSize}`)
            .append('sortField', sortField)
            .append('sortOrder', sortOrder);
        for (let p in tableFileds){
            params = params.append(p, tableFileds[p]);
        }
       return this.http.get(`${ajaxUrl}`, {
            params: params
        })
    }

    constructor(private http: HttpClient) {
    }

}