import {Component, OnInit,Input} from '@angular/core';
import {Router} from "@angular/router";
import {SchedulerTaskModel} from '../report-models/report.model';
import * as dataOurTime from "../../../../libs/util";
import {DialogCommunicationService} from "../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../common/dialog/dialog_data.model";

import {DatatowarrantCommunicationService} from "../report-service/reporttowarrant.communication.service";
import {ReportToWarrantCommunicationService} from "../report-service/reporttowarrant.service";

@Component({
    selector: 'reporttlist-table',
    templateUrl: 'reporttlist-table.component.html'
})

export class ReporttlistTableComponent implements OnInit {
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

    constructor(private communication: DatatowarrantCommunicationService,
                private datacauseCommunicationService: ReportToWarrantCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.communication.jsonPath = this.jsonpath;
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
        this.router.navigateByUrl(this.config.detailUrl + "/" + project.id + "/" + 0)
    }

}
