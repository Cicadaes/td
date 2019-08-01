import {Component, OnInit} from '@angular/core';
import {DialogData, DialogConfirm} from "../../common/dialog/dialog_data.model";
import {SchedulerTaskModel} from '../../report-models/report.model';
import {Router} from "@angular/router";
import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";
import {DialogCommunicationService} from "../../report-service/dialog.communication.service";
@Component({
    selector: 'report-browser',
    templateUrl: 'report-browser.component.html',
    styles: [`
        .project_list{
            margin-bottom: 12px;
            border-bottom: 1px solid #dde0e3;
            height: 36px;
        }
         .project_list li{
                height: 36px;
    line-height: 36px;
    border: 1px solid #dde0e3;
    border-bottom: 0 none;
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    border-radius: 0;
    /* padding: 0 16px; */
    cursor: pointer;
    float: left;
    overflow: hidden;
    width: 80px;
    text-align: center;
         } 
         
         .project_list li.active{
                    line-height: 36px;
        height: 37px;
        border: 1px solid #d4e0f1!important;
        border-bottom-color: #fff!important;
        border-top: 3px solid #5697f1!important;
        color: #464C5B!important;
        background: #fff;
        position: relative;
        bottom: 1px;
         }
        :host /deep/ .add_project .ui-datatable.ui-widget{
             max-height:400px;
             overflow: auto;
             width: 752px;
         }
         
         .add_project{
            margin: 15px 0;
         }
        :host /deep/ .ui-state-default .ui-unselectable-text{
          text-align:left !important;
          padding-left:20px !important;
         }  
        :host /deep/ .ui-datatable tbody td {
          text-align:left !important;
          padding-left:20px !important;
      }

    `]
})
export class ReportBrowserComponent {
    prviewTab: boolean = true;
    prviewMetaTab: boolean = false;
    postData: any;
    previewMetaData: any;
    prviewData: any
    pageDisplay: boolean = true;
    private DataPrview: boolean = false;
    reportPaginator: boolean = false;
    datareportId: any;
    dispatDatas: SchedulerTaskModel[] = [];
    newDatas: any[] = [];
    dispatTotal: number;
    queryObj: any = {}
    currentPage: number = 1;
    currentRows: number = 10;
    colmeta: any[] = [];
    value: any = {
        totalRecords: 0, //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10, //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    };
    cols: any[] = [];
    saveId: number = null;

    constructor(private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionShowDataPrviewe$.subscribe((data: any) => {
            this.datacauseCommunicationService.hideAllLayer()
            this.initData(data);
        })

        this.datacauseCommunicationService.missionHideAllLayer$.subscribe((data: any) => {
            this.DataPrview = false;
        })

        this.datacauseCommunicationService.missionPreviewConnections$.subscribe((data: any) => {
            this.initData(data);
        })
    }

    initData(data: any) {
        this.DataPrview = true;
        this.saveId = data.saveId;
        delete data.saveId;
        this.prviewData = this.previewMetaData = this.cols = this.colmeta = [];
        this.getPreviewMetaData(data)
        this.postData = data;
        this.postData.page = this.currentPage;
        this.postData.pageSize = this.value.pageLinkSize;
        console.log(this.postData)
        this.datacauseCommunicationService.changePageSource$.subscribe(newPage => this.page(newPage))
        this.page(1)
    }


// 元数据
    getPreviewMetaData(data: any) {
        this.communication.previewMetaData(data).then((res: any) => {
            this.previewMetaData = res;
            console.log(this.previewMetaData)
            if (this.previewMetaData && this.previewMetaData.length > 0) {
                let obj = this.previewMetaData[0];
                let list = [];
                for (let i in obj) {
                    list.push({value: i, key: obj[i]})
                }
                this.colmeta = list;
            }

            if (res.success == false) {
                this.dialogCommunicationService.addMessage({severity: 'error', summary: '请求失败', detail: res.message})
            }
            if (res.success == true) {
                this.dialogCommunicationService.addMessage({severity: 'success', summary: '请求成功', detail: res.message})
            }
        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }


    page(newPage: number) {
        if (newPage == 0) {
            this.dispatDatas = null
        }
        this.currentPage = newPage;
        this.refreshData();
    }

    refreshData() {
        this.communication.prviewData(this.postData).then(res => {
            if (res.success == false) {
                this.pageDisplay=false;
                this.dialogCommunicationService.addMessage({severity: 'error', summary: '请求失败', detail: res.message})
            }
            if (res.success == true) {
                this.pageDisplay=true;
                this.prviewData = res.data;
                this.dispatTotal = (res.data.length) - 1;
                this.value.totalRecords = (res.data.length) - 1;
                if (res.data.length > 0) {
                    this.reportPaginator = true;
                }
                console.log(this.prviewData)

                this.paginate({page: 0, rows: "10"});
                this.buildCols()
            }
        }).catch(err => {
            console.log(err)
        })
    }

// 处理数据
    buildCols() {
        if (this.prviewData && this.prviewData.length > 0) {
            let obj = this.prviewData[0];
            let list = [];
            for (let i in obj) {
                list.push({value: i, key: obj[i]})
            }
            this.cols = list;
        }
    }

    //翻页
    paginate(params: any) {
        console.log(params, params.page * params.rows, (params.page + 1) * params.rows);
        this.currentRows = params.rows;
        this.newDatas = null;
        setTimeout(() => {
            this.newDatas = this.prviewData.slice(params.page * params.rows, (params.page + 1) * params.rows)
        }, 100)


    }

    clickCon(e: any) {
        console.log(e.target.id);
        if (e.target.id == "1") {
            this.prviewTab = true;
            this.prviewMetaTab = false;
        }
        if (e.target.id == "2") {
            this.prviewMetaTab = true;
            this.prviewTab = false;
        }
    }

    cancel() {
        this.DataPrview = false;
        if (this.saveId == 1) {
            this.datacauseCommunicationService.hidePreview()
        } else if (this.saveId == 2) {
            this.datacauseCommunicationService.hideDatasource()
        }
    }
}