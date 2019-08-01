import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DetailAppPageService {
    private showDetail = new Subject<boolean>();
    private  paramId = new Subject<number>();

    addAppUrl = window['appConfig']['apiCode']+'/appController/queryAppById';
    constructor(private http: HttpClient) {

    }
    showDetailSwitch$ = this.showDetail.asObservable();
    paramsIdSwitch$ = this.paramId.asObservable();
    //切换detail显示隐藏
    switchShow (showOr: boolean){
        this.showDetail.next(showOr);
    }
    //改变id参数获取详情
    changeId (idParam: any){
        this.paramId.next(idParam);
    }
    getAppPageDetail(id: number){
        let params = {
            id:id
        };
        return this.http.post(`${this.addAppUrl}`, {
            params: params
        });
    }

}