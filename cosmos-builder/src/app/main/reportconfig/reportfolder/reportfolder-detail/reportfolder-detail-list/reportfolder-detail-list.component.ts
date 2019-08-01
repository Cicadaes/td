import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute,ParamMap ,Router} from '@angular/router';
import {  ReportMoveService } from '../../../report/report-move/report-move.service';
import { AfterViewInit, ViewChild } from '@angular/core';
import { ReportfolderDetailListService } from './reportfolder-detail-list.service';
import { ReportAdvancedSearchService } from '../../../report/report-advanced-search/report-advanced-search.service';
import { Subscription } from 'rxjs/Subscription';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../../config/config.msg';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { ReportfolderlistService } from '../../reportfolder-list/reportfolder-list.service';
import { ReportlistService } from '../../../report/report-list/report-list.service';
import { ReportPublishService } from '../../../report/report-publish/report-publish.service';
import { ReportModifyService } from '../../../report/report-list/report-modify/report-modify.service';
@Component({
    selector: 'reportfolder-detail-list',
    templateUrl: './reportfolder-detail-list.component.html',
    styleUrls: ['./reportfolder-detail-list.component.less']
})
export class ReportfolderDetailListComponent implements OnInit, OnDestroy {
    _dataSet: any  = [];
    _total: number;
    _data:any;
    subscription: Subscription;//重复订阅问题
    id:any;
    status:string;
    pageIndex:number = 1;
    queryParam: any = {
        page: 1,
        pageSize: 10,
        nameOperator:"like",
        orderBy:"createTime",
        order:"desc"
    };//查询条件
    constructor(
        private reportfolderDetailListService: ReportfolderDetailListService,
        private reportAdvancedSearchService: ReportAdvancedSearchService,
        private route: ActivatedRoute, 
        private _notification: CmNotificationService,
        private ReportlistService: ReportlistService,
        private reportfolderlistService: ReportfolderlistService,
        private router: Router,
        private reportMoveService:ReportMoveService,
        private reportPublishService:ReportPublishService,
        private reportModifyService:ReportModifyService,
        private confirmServ: CmModalService,
    ) {
        this.subscription = this.reportAdvancedSearchService.missionGrabble$.subscribe((grabble:any) => {
            this.queryParam.page = 1;
            this.queryParam.pageSize = 10;
            this.searchMissHandler(grabble);         
        }); 
         // 确认发布
         this.subscription = this.reportPublishService.missionpublishReportOK$.subscribe((obj: any) => {
            this.publishOK(obj);
        });
    }

    // 移动报表
    show(data:any){
        this.reportMoveService.isShowMove(data)
        let index = -1;
        this.reportfolderlistService.query({pageSize: 1000000}).then((response: any) => {
            let moveId = -1;           
            for(var i=0,len=response.data.length;i<len;i++){
                if(response.data[i].id == data.folderId){
                    index = i;
                    moveId = response.data[i].id;
                }
            }
            this._data = response.data;  
            this._data.splice(index,1)
            this.ReportlistService.saveData(this._data,moveId);
        }).catch((err)=>{
            // return this._notification.error(err, "", msg['notification']['error'])
        })
    } 
    ageIndexChange(pageIndex: number) {
        this.refreshData();
    }

    changePageSize(event: any){
        this.queryParam.pageSize = event;
        this.refreshData();
    }
    pageIndexChange(pageIndex: number) {
        this.refreshData();
        this.pageIndex = pageIndex;
    }

    ngOnInit() {
        this.refreshData();
    }
    searchMissHandler(grabble: any) {
        if (grabble.Name) {
            this.queryParam['name'] = `%25${grabble.Name}%25`;
        } else {
            delete this.queryParam['name'];
        }
        this.refreshData();
    }
   
    refreshData() {
        this.queryParam['folderId']  = this.route.snapshot.params.id;
        this.reportfolderDetailListService.query(this.queryParam).then((response: any) => {
            this._total = response.total;
            this._dataSet = response.data;

            for (var i = 0,len = this._dataSet.length; i < len; i++) {
                this._dataSet[i].createTime = this._dataSet[i].createTime.split(" ")[0];
                if (this._dataSet[i].status == 0) {
                    this.status = '未发布'
                } else if (this._dataSet[i].status == 1) {
                    this.status = '发布'
                } else if (this._dataSet[i].status == 2) {
                    this.status = '下线'
                }
            }
        }).catch((err)=>{
            // return this._notification.error(err, "", msg['notification']['error'])
        })
    }

    // 取消发布
    offline(data:any){   
        let obj = { "id":data.id };
        this.ReportlistService.offline(obj).then((response: any) => {
            if (JSON.parse(response._body).success) {
                this.reportAdvancedSearchService.homeValue({page:this.pageIndex});
                this.refreshData();
                return this._notification.success(JSON.parse(response._body).msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(JSON.parse(response._body).msg, "", msg['notification']['error'])
            }
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }

    // 发布报表
    publish(data:any){
        this.reportPublishService.ispublishReport(data);
    }

    // 去详情
    toDetail(status:number,id:number){
        if(status == 1){
            this.router.navigate(['/publish/' + id]);
        }else{
            this.router.navigate(['/main/reportconfig/reportDetail/' + id+'?mode = preview']);
        }
    }

    // 发布确认
    publishOK(data: any) {
        this.ReportlistService.publish(data).then((response: any) => {
            if (JSON.parse(response._body).success) {
                this.reportAdvancedSearchService.homeValue({page:this.pageIndex});
                this.refreshData();
                return this._notification.success(JSON.parse(response._body).msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(JSON.parse(response._body).msg, "", msg['notification']['error'])
            }
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }

    //删除报表
    showConfirm(data:any){
        let that = this;
        if(data.status==0){
            data.showOpera = false;
            this.confirmServ.confirm({
                title: `确认删除报表${data.name}吗`,
                showConfirmLoading: true,
                onOk() {
                    that.deleteReport(data.id);
                },
                onCancel() {
                }
            });
        }
    };

    //删除报表
    deleteReport(id:number){
        this.reportfolderDetailListService.delete(id).then((response: any) => {
            if (JSON.parse(response._body).success) {
                this.reportAdvancedSearchService.homeValue({page:this.pageIndex});
                this.refreshData();
                return this._notification.success(JSON.parse(response._body).msg, "", msg['notification']['success'])
            } else {
                return this._notification.error(JSON.parse(response._body).msg, "", msg['notification']['error'])
            }
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }

    //编辑报表
    updateReport(data:any){
        data.showOpera = false;
        this.reportModifyService.UpdateReport(data);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}

