import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SchedulerTaskModel} from '../../../report-models/report.model';
import {DatasourceCommunicationService} from "../../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../../report-service/datacause.service";
import * as dataOurTime from "../../../../../../libs/util";
import {DialogCommunicationService} from "../../../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../../../common/dialog/dialog_data.model";

@Component({
    selector: 'sample-report-table',
    templateUrl: 'sample-report-table.component.html',
    styles: [`

:host /deep/ .ui-datatable .ui-datatable-data tr td em{
    width:auto !important;
    padding:2px 5px;
    display: block;
} 

:host /deep/ .ui-datatable .ui-datatable-data tr td:hover em{
 display: block;
} 
:host/deep/ .computing_detail_table {
   padding:0;
   padding-right:20px;
    margin-left:20px;
   
}
:host/deep/ .ui-state-default .ui-unselectable-text{
    width:150px;
    display:table-cell;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
}

    `]
})

export class SampleReportTableComponent implements OnInit {

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
    cols: any[] = [];
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
        this.communication.querysample(this.datareportId).then(res => {
            this.dispatDatas = res.data;
            this.dispatTotal = (res.data.length) - 1;
            this.value.totalRecords = (res.data.length) - 1;
            if(res.data.length > 0) {
                this.reportPaginator = true;
            }
            console.log(this.dispatDatas)

            this.paginate({ page: 0, rows: "10" });
            this.buildCols();

        }).catch(err => { console.log(err) })
    }

    buildCols(){
        if(this.dispatDatas && this.dispatDatas.length > 0){
            let obj = this.dispatDatas[0];
            let list = [];
            for(let i in obj){
                list.push({value:i,key:obj[i]})
            }
            this.cols = list;
        }
    }

    //翻页
    paginate(params: any) {
        console.log(params,params.page * params.rows,(params.page + 1) * params.rows);
        this.currentRows = params.rows;
        this.newDatas = null;
        setTimeout(() => {
            this.newDatas = this.dispatDatas.slice(params.page * params.rows, (params.page + 1) * params.rows)
            for (let i in this.newDatas) {
                this.newDatas[i].create_time = dataOurTime.date(this.newDatas[i].create_time, null);
            }
        }, 100)


    }

    downloadData(){
        this.communication.querydownload(this.datareportId)
            .catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '下载样例数据失败', detail: err._body }))
    }
}
