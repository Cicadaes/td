import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
interface AppState {
    reportTabs: any;
}

@Injectable()
export class ReporthomeService {

    reportTabs$: any;
    istabs:number;
    constructor(
        private router: Router,
        private store: Store<AppState>
    ) { 
        this.reportTabs$ = store.select('reportTabs');
        this.reportTabs$.subscribe((data: any) => {
            this.istabs = data;
        });
    }
   
}