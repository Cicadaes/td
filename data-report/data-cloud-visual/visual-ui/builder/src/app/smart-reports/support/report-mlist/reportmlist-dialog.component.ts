import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {DatareportCommunicationService} from "../report-service/datareport.communication.service";
import {DatareportcauseCommunicationService} from "../report-service/datareportcause.service";

import {DialogCommunicationService} from "../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../common/dialog/dialog_data.model";
import {isNumber} from "util";

@Component({
    selector: 'reportmlist-dialog',
    templateUrl: 'reportmlist-dialog.component.html',
    styles: [`
    `]
})

export class ReportmlistDialogComponent implements OnInit {
    @Input() config:any;

    display: boolean = false;
    dialogWidth: number = 490;
    taskTitle: any = "新建报表";
    dataName:string;
    dataDesc:string;
    showerrTip:boolean = false;
    errorTip:string;
    createObj:any = {};
    mlistType:any;
    dataId:any;


    constructor(private communication: DatareportCommunicationService,
                private datacauseCommunicationService: DatareportcauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionAddLayerShowSource$.subscribe((data:any) =>{
            this.display = true;
            this.showerrTip = false;
            this.dataName = "";
            this.dataDesc = "";
            this.mlistType = data.type;

            if(this.mlistType == 1){
                this.dataName = "";
                this.dataDesc = "";
                this.taskTitle = "新建报表";
            }else if(this.mlistType == 2){
                this.taskTitle = "编辑报表";
                this.dataName = data.name;
                this.dataDesc = data.description;
                this.dataId = data.id;
            }

        })
    }

    ngOnInit() {

    }

    cancel(){
        this.display = false;
        this.dataName = "";
        this.dataDesc = "";
    }



    changeFromName() {
        if (this.dataName == '' || this.dataName == undefined) {
            this.showerrTip = true;
            this.errorTip = "报表名称不能为空";
            return false
        }else if (!this.illegalChar(this.dataName)) {
            this.showerrTip = true;
            this.errorTip = "报表名称不能包含特殊字符（\/:?<>|）"
            return false
        }else{
            this.showerrTip = false;
            this.errorTip = "";
        }
        return true;
    }

    confirm(){
        if(!this.changeFromName()){
            return;
        }
        this.createObj.name = this.dataName;
        this.createObj.description = this.dataDesc;

        if(this.mlistType == 1){
            this.communication.savereport(this.createObj)
                .then(res => {
                    if(res.success == false){
                        this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: res.msg })
                    }
                    if(res.success == true){
                        this.router.navigateByUrl("/" + process.env.DIST + '/datareport/editReport/' + res.reportId)
                        this.display = false;
                    }

                }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: err._body }))
        }else if(this.mlistType == 2){
            this.createObj.id = this.dataId
            this.communication.updatereport(this.createObj)
                .then(res => {
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: '更新报表成功', detail: '' })
                    this.display = false;
                    this.datacauseCommunicationService.updateList()
                }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新报表失败', detail: err._body }))
        }



    }

    private illegalChar(str: any) {
        let pattern = /^[a-zA-Z0-9_*\.?*\-?\u4e00-\u9fa5]+$/
        if (!pattern.test(str)) {
            return false;
        }
        return true;
    }
}
