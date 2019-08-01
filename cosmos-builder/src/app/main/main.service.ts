import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MainService {

    isCollapsed: boolean = false;
    title: Array<any> = ["报表配置"];
    // Observable string sources
    private menuSource = new Subject<boolean>();
    private titleSource = new Subject<Array<any>>();

    // Observable string streams
    missionMenu$ = this.menuSource.asObservable();
    missionTitle$ = this.titleSource.asObservable();

    // Service message commands
    menuMission(menu: boolean) {
        this.isCollapsed = menu;
        this.menuSource.next(menu);
    }

    titleMission(title: Array<any>) {
        this.titleSource.next(title);
    }

}