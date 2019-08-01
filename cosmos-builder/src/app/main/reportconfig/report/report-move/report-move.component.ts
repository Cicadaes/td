import { Component, OnInit, OnDestroy ,Input} from '@angular/core';
import { ReportMoveService } from './report-move.service';
import { Subscription } from 'rxjs/Subscription';
import { RouterModule, ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ReportAdvancedSearchService } from '../report-advanced-search/report-advanced-search.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../config/config.msg';
import { ReportMoveListService} from './report-move-list/report-move-list.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ReportMoveListComponent } from './report-move-list/report-move-list.component';

@Component({
    selector: 'report-move',
    templateUrl: './report-move.component.html',
    styleUrls: ['./report-move.component.less']
})

export class ReportMoveComponent implements OnInit, OnDestroy {
    id:number;
    _check:boolean = false;
    reportInfo:Object;
    isVisibleTop = false;
    isVisibleMiddle = false;
    objsure: Object = {};
    subscription: Subscription;//重复订阅问题
    title:string;

    constructor(
        private reportMoveService: ReportMoveService,
        private reportMoveListService: ReportMoveListService,
        private router: Router,
        private reportAdvancedSearchService:ReportAdvancedSearchService,
        private _notification: CmNotificationService
    ) {
        this.subscription = this.reportMoveListService.missionCheck$.subscribe((grabble: any) => {
            this._check = grabble;
        });
        this.subscription = this.reportMoveService.missionshowMove$.subscribe((data: any) => {
            this.showModalMiddle(data);
        });
    }

    ngOnInit() {
    }

    showModalTop = () => {
        this.isVisibleTop = true;
    };

    showModalMiddle (data:any){
        this.title = data.name;
        this.isVisibleMiddle = true;     
        this.objsure= {
            "id":data.id,
            "name":data.name,
            "status":data.status,
            "description": data.description
        }
    };

    handleOkTop = (e: any) => {
        this.isVisibleTop = false;
    };
    handleCancelMiddle = (e: any) => {
        this.isVisibleMiddle = false;
        // console.log('点击取消')
        this.move._value = "";
    };
    handleCancelTop = (e: any) => {
        this.isVisibleTop = false;
    };

    @ViewChild(ReportMoveListComponent)
    private move: ReportMoveListComponent;

    handleOkMiddle = (e: any) => {
        this.isVisibleMiddle = false;
        this.objsure['folderId'] = this.reportMoveService.folderId;
        this.move._value = "";
        this.refreshData();
        this._check = false;
    };
    
    refreshData() {
        this.reportMoveService.update(this.objsure).then((response: any) => {
            if (JSON.parse(response._body).success) { 
                this.reportAdvancedSearchService.homeValue({});                
                this.reportAdvancedSearchService.moveReportOK('move');                
                return this._notification.success(JSON.parse(response._body).msg, "", msg['notification']['success']) 
            } else{
                return this._notification.error(JSON.parse(response._body).msg, "", msg['notification']['error']) 
            }
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error']) 
        });
    }

   

    ngOnDestroy() {

    }

}

