import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../../main.service';
import { Subscription } from 'rxjs/Subscription';
import { ReporthomeService } from './reporthome.service';
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
interface AppState {
    reportTabs: any;
}
@Component({
    selector: 'reporthome',
    templateUrl: './reporthome.component.html',
    styleUrls: ['./reporthome.component.less']
})
export class ReporthomeComponent implements OnInit, OnDestroy {

    tabIndex:number;
    title:Array<any>;
    tabs = [    
        {'name':'文件夹','url':'reportconfig'},
        {'name':'报表','url':'reportconfig'},
    ];

    constructor(
        private route:ActivatedRoute, 
        private mainService:MainService,
        private reporthomeService:ReporthomeService,
        private store: Store<AppState>,
    ) {
        this.title = this.route.snapshot.data['title'];
        let reportTabs$: any = store.select('reportTabs');
        reportTabs$.subscribe((data: any)=>{
           this.tabIndex= data;
        })
    }

    ngOnInit() {
        this.changeTitle(this.title);
     }

    changetabs(tab:string){       
        this.title[1] = tab;
        this.changeTitle(this.title);
    }

    changeTitle(title:Array<any>){
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }
  
    ngOnDestroy() {

    }

}

