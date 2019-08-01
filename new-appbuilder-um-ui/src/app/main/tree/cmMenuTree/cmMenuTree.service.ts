import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ComMenuTreeService {
    private grabbleSource = new Subject<any>();
    private Radio = new Subject<any>();
    private data = new Subject<any>();
    public disabledchange = new Subject<any>();
    public menu = new Subject<any>();
    public click = new Subject<any>();
    public selectRadio: any = null;
    missionGrabble$ = this.grabbleSource.asObservable();
    missiongetRadio$ = this.Radio.asObservable();
    missiondataChange$ = this.data.asObservable();
    missiondisabled$ = this.disabledchange.asObservable();
    missioncreateMenu$ = this.menu.asObservable();
    missionclickItems$ = this.click.asObservable();

    clickItems(select: any) {
        this.click.next(select);
    }

    createMenu(value: any, select: any) {
        const obj = {};
        obj['type'] = value;
        obj['select'] = select;
        this.menu.next(obj);
    }

    disabledChange(value: any) {
        this.disabledchange.next(value);
    }

    moveFile(select: any, data: any) {
        const obj = {};
        obj['select'] = select;
        obj['data'] = data;
        this.grabbleSource.next(obj);
    }

    getRadio(value: any) {
        this.Radio.next(value);
    }

    dataChange(type: any, select: any) {
        // console.log(type,select);
        const obj = {};
        obj['type'] = type;
        obj['select'] = select;
        this.data.next(obj);
    }

}
