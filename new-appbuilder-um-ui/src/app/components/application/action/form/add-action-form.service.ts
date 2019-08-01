import { Component, Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AddActionFormService {
    
    getActionAttributeUrl: string = '/console-api//functionAttribute/list';
    idNum:number;
    //创建监听，监听是否为编辑时
    private editIdSub = new Subject<any>();
    editGrabble$ = this.editIdSub.asObservable();
    idValue(value: any) {
        this.editIdSub.next(value);
    }
    
    constructor(private http: HttpClient) {

    }
    getActionAttribute(params: any) {
        return this.http.post(`${this.getActionAttributeUrl}`, params)

    }
    // 校验URL
    private checkUrl: string = '/console-api/function/checkFunction'

    /**
     * 校验是否重复
     * @param  {any}    param [description]
     * @return {[type]}       [description]
     */
    public checkRepeat(params: any) {
        return this.http.post(`${this.checkUrl}`, params)
    }
}