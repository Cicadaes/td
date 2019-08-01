import { Component, OnInit, OnDestroy,AfterViewInit, ViewChild  } from '@angular/core';
import { ReportMoveComponent } from '../report-move/report-move.component';
import { Subscription } from 'rxjs/Subscription';
import { RouterModule, ActivatedRoute ,Router} from '@angular/router';
import { ReportlistService } from './report-list.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { msg } from '../../../../../config/config.msg';
import { ReportAdvancedSearchService } from '../report-advanced-search/report-advanced-search.service';
import { ReportfolderlistService } from '../../reportfolder/reportfolder-list/reportfolder-list.service';
import { ReportPublishService } from '../report-publish/report-publish.service';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { ReportModifyService } from './report-modify/report-modify.service';
@Component({
    selector: 'report-list',
    templateUrl: './report-list.component.html',
    styleUrls: ['./report-list.component.less']
})
export class ReportListComponent implements OnInit, OnDestroy {
    _dataSet: any = [];
    _data: any = [];
    _total: number;
    subscription: Subscription;//重复订阅问题
    id: number;
    status: string;
    pageIndex:number = 1;
    queryParam: any = {
        page: 1,
        pageSize: 10,
        nameOperator: "like",
        orderBy: "createTime",
        order: "desc"
    };//查询条件
    private showOpera:boolean = false;
    constructor(
        private ReportlistService: ReportlistService,
        private reportAdvancedSearchService: ReportAdvancedSearchService,
        private route: ActivatedRoute,
        private _notification: CmNotificationService,
        private reportfolderlistService: ReportfolderlistService,
        private reportPublishService:ReportPublishService,
        private router: Router,
        private confirmServ: CmModalService,
        private reportModifyService:ReportModifyService
    ) {
        this.subscription = this.reportAdvancedSearchService.missionGrabble$.subscribe((grabble: any) => {
            this.queryParam.page = 1;
            this.queryParam.pageSize = 10;
            this.searchMissHandler(grabble);
        });
        // 确认发布
        this.subscription = this.reportPublishService.missionpublishReportOK$.subscribe((obj: any) => {
            this.publishOK(obj);
        });
    }

    @ViewChild(ReportMoveComponent)
    private create: ReportMoveComponent;

    show(data: any) {
        this.create.showModalMiddle(data);
        let index = -1;
        this.reportfolderlistService.query({pageSize:10000000}).then((response: any) => { 
            let moveId = 0;          
            for(var i=0,len=response.data.length;i<len;i++){
                if(response.data[i].id == data.folderId){
                    index = i;
                    moveId = response.data[i].id;
                }
            }
            this._data = response.data;  
            this._data.splice(index,1)
            this.ReportlistService.saveData(this._data,moveId)
        }).catch((err)=>{
            // return this._notification.error(err, "", msg['notification']['error'])
        })
    }

    pageIndexChange(pageIndex: number) {
        this.refreshData();
        this.pageIndex = pageIndex;
    }

    changePageSize(event: any) {
        this.queryParam.pageSize = event;
        this.refreshData();
    }

    searchMissHandler(grabble: any) {
        if (grabble.Name) {
            this.queryParam["nameOperator"] = "like";
            this.queryParam['name'] = `%25${grabble.Name}%25`;
        } else {
            delete this.queryParam['name'];
        }
        
        if (grabble.page) {
            this.queryParam["page"] = grabble.page;
        }

        if (grabble.reportStatus == 1) {
            this.queryParam['status'] = grabble.reportStatus;
        } else if (grabble.reportStatus == 0) {
            this.queryParam['status'] = grabble.reportStatus;
        } else if (grabble.reportStatus == 2) {
            this.queryParam['status'] = grabble.reportStatus;
        }
        else {
            delete this.queryParam['status'];
        }

        if (grabble.folder) {
            this.queryParam["folderNameOperator"] = "like";
            this.queryParam['folderName'] = `%25${grabble.folder}%25`;
        } else {
            delete this.queryParam['folderName'];
        }

        if (grabble.createTime) {
            this.queryParam['createTime1'] = this.formatDate(grabble.createTime[0]);
            // console.log(this.formatDate(grabble.createTime))
        } else {
            delete this.queryParam['createTime1'];
        }
        if (grabble.createTime) {
            this.queryParam['createTime2'] = this.formatDate(Date.parse(grabble["createTime"][1])+(1000*60*60*24-1));
        } else {
            delete this.queryParam['createTime2'];
        }

        if (grabble.founder) {
            this.queryParam["creatorOperator"] = "like";
            this.queryParam['creator'] = `%25${grabble["founder"]}%25`;
        } else {
            delete this.queryParam['creator'];
        }
        this.refreshData();
    }

    refreshData() {
        this.ReportlistService.query(this.queryParam).then((response: any) => {
            if(response){
                this._total = response.total;
                this._dataSet = response.data;
                for (var i = 0, len = this._dataSet.length; i < len; i++) {
                    this._dataSet[i]['showOpera'] = false;
                    this._dataSet[i].createTime = this._dataSet[i].createTime.split(" ")[0];
                }
            }
        }).catch(err => {
            // return this._notification.error(err, "", msg['notification']['error'])
        });
    }

    formatDate(time: any): any {
        let year, month, day, hours, minutes, seconds;
        if (time) {
            year = new Date(time).getFullYear()
            year = year < 10 ? "0" + year : year
            month = new Date(time).getMonth() + 1
            month = month < 10 ? "0" + month : month
            day = new Date(time).getDate()
            day = day < 10 ? "0" + day : day
            hours = new Date(time).getHours()
            hours = hours < 10 ? "0" + hours : hours
            minutes = new Date(time).getMinutes()
            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds = new Date(time).getSeconds()
            seconds = seconds < 10 ? "0" + seconds : seconds
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }
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
        this.reportPublishService.ispublishReport(data)
    }

    // 去详情
    toDetail(status:number,id:number){
        if(status == 1){
            this.router.navigate(['/publish/' + id]);
        }else{
            this.router.navigate(['/main/reportconfig/reportDetail/' + id+'?mode=preview']);
        }
    }


    ngOnInit() {
        this.refreshData();
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
        this.ReportlistService.remove(id).then((response: any) => {
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

