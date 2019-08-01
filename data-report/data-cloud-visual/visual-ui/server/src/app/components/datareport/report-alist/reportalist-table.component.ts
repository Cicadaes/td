import {Component, OnInit,Input} from '@angular/core';
import {Router} from "@angular/router";
import {SchedulerTaskModel} from '../../../models/report/report.model';
import * as dataOurTime from "../../../../../public/js/util";
import {DialogCommunicationService} from "../../../services/dialog/dialog.communication.service";
import {DialogData, DialogConfirm} from "../../../common/dialog/dialog_data.model";

import {DatapushCommunicationService} from "../../../services/report-service/reportpush.communication.service";
import {ReportPublishingCommunicationService} from "../../../services/report-service/reportpublishing.service";

import {AppCommunicationService} from "../../../services/app.communication.service"

@Component({
    selector: 'reportalist-table',
    templateUrl: 'reportalist-table.component.html'
})

export class ReportalistTableComponent implements OnInit {
    @Input() config:any;
    @Input() jsonpath:string

    dispatDatas: SchedulerTaskModel[] = [];
    dispatTotal: number;
    queryObj: any = {}
    currentPage: number = 1;
    currentRows: number = 10;
    value: any = {
        totalRecords: 0, //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10, //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    };

    constructor(private communication: DatapushCommunicationService,
                private datacauseCommunicationService: ReportPublishingCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private appCommunicationService: AppCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionUpdateListConfirmed$.subscribe(()=>{

        })
    }

    ngOnInit() {
            this.datacauseCommunicationService.setQueryObjSource$.subscribe(queryObj => this.queryObj = queryObj)
            this.datacauseCommunicationService.changePageSource$.subscribe(newPage => this.page(newPage))
            this.datacauseCommunicationService.missionUpdateListConfirmed$.subscribe(() => this.page(1))
            this.page(1)
    }

    page(newPage: number) {
        // if (this.currentPage != 1 && newPage == 1) {
        if (newPage == 1) {
            this.dispatDatas = null
        }
        this.currentPage = newPage
        this.refreshData()
    }

    refreshData() {
        this.queryObj.page = this.currentPage
        this.queryObj.pageSize = this.currentRows;
        this.communication.query(this.queryObj).then(res => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].createTime = dataOurTime.date(res.data[i].createTime, null);
                res.data[i].updateTime = dataOurTime.date(res.data[i].updateTime, null);
            }
            this.dispatDatas = res.data as SchedulerTaskModel[];
            this.dispatTotal = res.total;

            this.value.totalRecords = res.total;
            console.log(res)
        }).catch(err => { console.log(err) })
    }

    //翻页
    paginate(params: any) {
        console.log(params);
        this.currentRows = params.rows;
        this.currentPage = params.page + 1;
        // this.page(this.currentPage);
        this.refreshData();
    }

    //授权
    toWarrantProject(data: any) {
        data = { obj: data, type: "editor" }
        this.datacauseCommunicationService.layerConfirmMission(data)
    }


    //进入详情
    detailTaskProject(project: any) {
        console.log(project.id, "project")
        this.router.navigateByUrl("/" +  process.env.DIST + '/datareport/previewReport/' + project.id)
    }

}
