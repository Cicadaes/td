import { Component, OnInit, Input } from '@angular/core';
import {Router} from "@angular/router";
import {SchedulerTaskModel} from '../report-models/report.model';
import * as dataOurTime from "../../../../libs/util";
import {DialogCommunicationService} from "../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../common/dialog/dialog_data.model";

import {DatareportCommunicationService} from "../report-service/datareport.communication.service";
import {DatareportcauseCommunicationService} from "../report-service/datareportcause.service";

@Component({
    selector: 'reportmlist-table',
    templateUrl: 'reportmlist-table.component.html',
    styles: [`        
        ul li.disabled{
            cursor: not-allowed!important;
            color: #d8dadc!important;
            pointer-events: none;
        }
        ul li.disabled span.iconfont,
        ul li.disabled:hover span.iconfont{
            color: #d8dadc!important;
        }
        ul li.disabled:hover{
            color: #d8dadc!important;
        }
    :host /deep/  .ui-datatable thead #btn {
            overflow:inherit !important;
        }   
        :host /deep/  .ui-datatable thead th {
            overflow:inherit !important;
        }   
        .ui-state-default .ui-unselectable-text{
            overflow:inherit !important;
        } 
    `]
})

export class ReportmlistTableComponent implements OnInit {
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

    constructor(private communication: DatareportCommunicationService,
                private datacauseCommunicationService: DatareportcauseCommunicationService,
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
        this.queryObj.order = "desc";
        this.queryObj.orderBy = "updateTime";
        this.communication.query(this.queryObj).then(res => {
            for (let i = 0; i < res.data.length; i++) {
                res.data[i].createTime = dataOurTime.date(res.data[i].createTime, null);
                res.data[i].updateTime = dataOurTime.date(res.data[i].updateTime, null);
                if(res.data[i].status == 2 || res.data[i].status == 0){
                   res.data[i].publishTime = null
                }else{
                   res.data[i].publishTime = dataOurTime.date(res.data[i].publishTime, null);
                }
               
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

    //编辑
    settingTaskProject(data: any) {
        data = { obj: data, type: "editor" }
        this.datacauseCommunicationService.layerConfirmMission(data)
    }

    //进入详情
    detailTaskProjectDet(project:any){
        if(project.status == 1){
            this.router.navigateByUrl("/" + process.env.DIST + "/datareport/previewReport/" + project.id)
        }else{
            this.router.navigateByUrl("/" + process.env.DIST + "/datareport/editReport/" + project.id)
        }
    }


    detailTaskProject(project: any) {
        console.log(project.id, "project")
        project.type = 2;
        this.datacauseCommunicationService.addLayerMission(project);

    }

    deleteDatasourceProject(project: any){
        let dialog = new DialogData();
        dialog.icon = "jinggao";
        dialog.title = "删除报表";
        dialog.content = `确定删除报表: ${project.name}？`;
        let confirm: DialogConfirm = new DialogConfirm();
        confirm.onConfirm = () => {
            this.communication.remove(project.id)
                .then(() => {
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: dialog.title + '成功',detail: "" })
                    for(let index in this.dispatDatas){
                        if(this.dispatDatas[index].id == project.id){
                            this.dispatDatas.splice(Number(index),1);
                        }
                    }
                }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: dialog.title + '失败', detail: err._body }))
        }
        dialog.confirms.push(confirm)
        this.dialogCommunicationService.showDialog(dialog)

    }

    editDatasourceProject(project: any){

    }

    //发布
    releaseDatasourceProject(project: any){
        console.log(project)
        let dialog = new DialogData()
        dialog.icon = "jinggao"
        dialog.title = "发布报表"
        dialog.content = `确定发布报表: ${project.name}？`
        let confirm: DialogConfirm = new DialogConfirm()
        let data={
            "id":project.id,
            "status": 1
        }  
        confirm.onConfirm = () => {        
            this.communication.create(data)
                .then((d) => {                                 
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: d.msg ,detail: "" })
                    for(let item of this.dispatDatas){
                        if(item.id == data.id){
                            item.status = 1;
                             this.refreshData();
                        }
                    }
                }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: err.msg, detail: err._body }))
        }
        dialog.confirms.push(confirm)
        this.dialogCommunicationService.showDialog(dialog)
    }

    
  outlineDatasourceProject(project: any){
       let dialog=new DialogData()
       dialog.icon='jinggao'
       dialog.title="下线报表"
       dialog.content = `确定下线报表： ${project.name}？`
      let confirm: DialogConfirm = new DialogConfirm()
        let data={
            "id":project.id,
            "status":2
        }  
        confirm.onConfirm = () => {
            this.communication.outline(data)
                .then((d) => {
                 console.log(this.dispatDatas)
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: d.msg ,detail: "" })
                    for(let item of this.dispatDatas){
                        if(item.id == data.id){
                            item.status = 2;
                             this.refreshData();
                        }
                    }
                }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: err.msg, detail: err._body }))
        }
        dialog.confirms.push(confirm)
        this.dialogCommunicationService.showDialog(dialog)

   }

}
