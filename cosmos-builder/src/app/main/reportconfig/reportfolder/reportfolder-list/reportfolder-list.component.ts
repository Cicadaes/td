import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../main.service';
import { ReportfolderlistService } from './reportfolder-list.service';
import { ReportfolderAdvancedSearchService } from '../reportfolder-advanced-search/reportfolder-advanced-search.service'
import { Subscription } from 'rxjs/Subscription';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../config/config.msg';

@Component({
    selector: 'reportfolder-list',
    templateUrl: './reportfolder-list.component.html',
    styleUrls: ['./reportfolder-list.component.less']
})
export class ReportfolderListComponent implements OnInit, OnDestroy {
    title: Array<any>;
    _dataSet: any  = [];
    _total: number;
    subscription: Subscription;//重复订阅问题

    queryParam: any = {
        page: 1,
        pageSize: 10,
        nameOperator:"like",
        orderBy:"createTime",
        order:"desc"
    };//查询条件

    constructor(
        private route: ActivatedRoute,
        private mainService: MainService,
        private ReportfolderlistService: ReportfolderlistService,
        private _notification: CmNotificationService,
         private reportfolderAdvancedSearchService: ReportfolderAdvancedSearchService
    ) {
        this.title = this.route.snapshot.data['title'];
        this.subscription = this.reportfolderAdvancedSearchService.missionGrabble$.subscribe((grabble:any) => {
            this.queryParam.page = 1;
            this.queryParam.pageSize = 10;
            this.searchMissHandler(grabble);
        });

    }

    changeTitle(title: Array<any>) {
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }

    searchMissHandler(grabble: any) {
        if (grabble.folderName) {
            this.queryParam["nameOperator"] = "like";
            this.queryParam['name'] = `%25${grabble.folderName}%25`;
        } else {
            delete this.queryParam['name'];
        }
        if (grabble.founder) {
            this.queryParam["creatorOperator"] = "like";
            this.queryParam['creator'] =  `%25${grabble.founder}%25`;
        } else {
            delete this.queryParam['creator'];
        }
        if (grabble.createTime) {
            this.queryParam['createTime1'] = this.formatDate(grabble.createTime[0]);
            // console.log(this.formatDate(grabble.createTime))
        } else {
            delete this.queryParam['createTime1'];
        } 
        if (grabble.createTime) {
            this.queryParam['createTime2'] = this.formatDate(Date.parse(grabble["createTime"][1])+(1000*60*60*24-1));
            // console.log(this.formatDate(grabble.createTime))
        } else {
            delete this.queryParam['createTime2'];
        } 
        this.refreshData();
    }

    pageIndexChange(pageIndex: number) {
        this.refreshData();
    }

    changePageSize(event: any){
        this.queryParam.pageSize = event;
        this.refreshData();
    }

    refreshData() {
        this.ReportfolderlistService.query(this.queryParam).then((response: any) => {
            if(response){
                this._total = response.total;
                this._dataSet = response.data;
                for(var i=0,len=this._dataSet.length; i<len;i++){
                    this._dataSet[i].createTime = this._dataSet[i].createTime.split(" ")[0]               
                }
            } 
        }).catch((err)=>{
            // return this._notification.error(err, "", msg['notification']['error'])
        })
    }
    formatDate(time: any): any {
        let year, month, day,hours,minutes,seconds;
        if (time) {
            year = new Date(time).getFullYear()
            year = year < 10 ? "0" + year : year
            month = new Date(time).getMonth() + 1
            month = month < 10 ? "0" + month : month
            day = new Date(time).getDate()
            day = day < 10 ? "0" + day : day
            hours=new Date(time).getHours()
            hours = hours < 10 ? "0" + hours : hours
            minutes=new Date(time).getMinutes()
            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds=new Date(time).getSeconds()
            seconds = seconds < 10 ? "0" + seconds : seconds
            return  `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }
    }
    ngOnInit() {
        this.refreshData();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}

