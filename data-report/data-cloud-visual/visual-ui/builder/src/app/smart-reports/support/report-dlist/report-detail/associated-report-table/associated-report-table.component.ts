import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SchedulerTaskModel} from '../../../report-models/report.model';
import {DatasourceCommunicationService} from "../../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../../report-service/datacause.service";
import * as dataOurTime from "../../../../../../libs/util";
import {DialogCommunicationService} from "../../../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../../../common/dialog/dialog_data.model";

@Component({
    selector: 'associated-report-table',
    templateUrl: 'associated-report-table.component.html'
})

export class AssociatedReportTableComponent implements OnInit {

    dispatDatas: SchedulerTaskModel[] = [];
    newDatas: any[] = [];
    dispatTotal: number;
    queryObj: any = {}
    currentPage: number = 0;
    currentRows: number = 10;
    value: any = {
        totalRecords: 0, //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10, //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    };
    datareportId:any;
    reportPaginator:boolean = false;

    constructor(private communication: DatasourceCommunicationService,
        private datacauseCommunicationService: DatacauseCommunicationService,
        private dialogCommunicationService: DialogCommunicationService,
        private router: Router) {
            this.datacauseCommunicationService.missionUpdateListConfirmed$.subscribe(()=>{})
    }

    ngOnInit() {
        console.log(this.router.url.substring(this.router.url.lastIndexOf("=") + 1));
        this.datareportId = this.router.url.substring(this.router.url.lastIndexOf("=") + 1);

        this.datacauseCommunicationService.changePageSource$.subscribe(newPage => this.page(newPage))
        this.page(0)
    }

    page(newPage: number) {
        if (newPage == 0) {
            this.dispatDatas = null
        }
        this.currentPage = newPage;
        this.refreshData();
    }

    refreshData() {
        this.communication.querydatasource(this.datareportId).then(res => {
            for (let i in res) {
                res[i].createTime = dataOurTime.date(res[i].createTime, null);
                res[i].updateTime = dataOurTime.date(res[i].updateTime, null);
            }
            this.dispatDatas = res as SchedulerTaskModel[];
            this.dispatTotal = res.length;
            this.value.totalRecords = res.length;
            if(res.length > 0){
                this.reportPaginator = true;
            }
            console.log(this.dispatDatas)

            this.paginate({ page: 0, rows: "10" })

        }).catch(err => { console.log(err) })
    }

    //翻页
    paginate(params: any) {
        console.log(params,params.page * params.rows,(params.page + 1) * params.rows);
        this.currentRows = params.rows;
        this.newDatas = null;
        setTimeout(() => {
            this.newDatas = this.dispatDatas.slice(params.page * params.rows, (params.page + 1) * params.rows)
        }, 100)

    }
}
