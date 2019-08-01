import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SchedulerTaskModel} from '../../../report-models/report.model';
import {DatasourceCommunicationService} from "../../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../../report-service/datacause.service";
import {DialogCommunicationService} from "../../../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../../../common/dialog/dialog_data.model";

@Component({
    selector: 'metadata-report-table',
    templateUrl: 'metadata-report-table.component.html',
    styles:[`
        .parameter_mar{
            margin: 2px 0;
        }
        :host /deep/ input.invaliderr{
            border-color: #FF0000!important;
        }
        :host /deep/ .argument{
            pointer-events: none!important;
        }
        :host /deep/ .iconfont.icon-tubiao01{
            position: absolute;
            right: 15px;
            display: none;
            font-size: 15px;
            top: 10px;
            cursor: pointer;
        }
        :host /deep/ .iconfont.icon-tubiao01:hover{
            color: #5697f1;
        }
        :host /deep/ .ui-datatable tr td{
            position: relative;
        }
        :host /deep/ .ui-datatable tr:hover td:last-child .iconfont.icon-tubiao01{
            display: block;
        }
    `]
})

export class MetadataReportTableComponent implements OnInit {

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
    display:boolean = false;
    taskTitle:string = "关联参数";
    dataName:string = "";
    relationParameters:boolean = true;
    parametersName:string = "";
    parametersObj:any = {};
    errorTips:boolean = false;

    constructor(private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionUpdateListConfirmed$.subscribe(()=>{})
    }

    ngOnInit() {
        this.datareportId = this.router.url.substring(this.router.url.lastIndexOf("=") + 1);
        this.datacauseCommunicationService.changePageSource$.subscribe(newPage => this.page(newPage))
        this.page(0)
    }
    setParameters(project:any){
        this.errorTips = false;
        this.parametersName = "";
        this.relationParameters = true;
        this.display = true;
        this.dataName = project.metadata;
        if(project.argument !== null){
            this.relationParameters = false;
            this.parametersName = project.argument;
        }
    }

    changeParameters(){
        this.errorTips = false;
    }

    cancel(){
        this.display = false;
    }

    checkFormData(){
        if(this.parametersName == ""){
            this.errorTips = true;
            return false;
        }else{
            this.errorTips = false;
        }
        return true;
    }

    confirm(){
        this.parametersObj.dataSourceId = parseInt(this.datareportId);
        this.parametersObj.metadata = this.dataName;
        if(!this.relationParameters){
            if(!this.checkFormData()){
                return;
            }
            this.parametersObj.argument = this.parametersName;
        }
        this.communication.saveparameters(this.parametersObj).then((res:any) => {
            this.display = false;
            this.dialogCommunicationService.addMessage({ severity: 'success', summary: '设置参数成功', detail: '' })
            this.page(0)
        }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '设置参数失败', detail: err._body }))

    }

    page(newPage: number) {
        if (newPage == 0) {
            this.dispatDatas = null
        }
        this.currentPage = newPage;
        this.refreshData();
    }

    refreshData() {
        this.communication.querymetadata(this.datareportId).then(res => {
            this.dispatDatas = res as SchedulerTaskModel[];
            this.dispatTotal = (res.length) - 1;
            this.value.totalRecords = (res.length) - 1;
            if(res.length > 0) {
                this.reportPaginator = true;
            }
            console.log(this.dispatDatas)

            this.paginate({ page: 0, rows: "10" })
            this.buildCols();

        }).catch(err => { console.log(err) })
    }

    buildCols(){
        if(this.dispatDatas && this.dispatDatas.length > 0){
            let obj = this.dispatDatas[0];
            let list = [];
            for(let i in obj){
                console.log(i)
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
            console.log(this.dispatDatas)
            this.newDatas = this.dispatDatas.slice(params.page * params.rows, (params.page + 1) * params.rows)
        }, 100)


    }
}
