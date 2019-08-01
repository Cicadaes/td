import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";

import {DialogCommunicationService} from "../../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../../common/dialog/dialog_data.model";
import {isNumber} from "util";

@Component({
    selector: 'reportddetail-dialog',
    templateUrl: 'reportddetail-dialog.component.html',
    styles: [`
    `]
})

export class ReportddetailDialogComponent implements OnInit {
    @Input() config:any;

    display: boolean = false;
    dialogWidth: number = 490;
    taskTitle: any = "新建报表";
    dataName:string;
    dataDesc:string;
    showerrTip:boolean = false;
    errorTip:string;
    createObj:any = {};


    constructor(private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionAddLayerShowSource$.subscribe((data:any) =>{
            this.display = true;
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
        this.communication.savereport(this.createObj)
            .then(res => {
                if(res.success == false){
                    this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: res.msg })
                }
                if(res.success == true){
                    this.router.navigateByUrl(this.config.reportUrl + "/" + res.reportId)
                }

            }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '', detail: err._body }))

    }

    private illegalChar(str: any) {
        let pattern = /^[a-zA-Z0-9_*\.?*\-?\u4e00-\u9fa5]+$/
        if (!pattern.test(str)) {
            return false;
        }
        return true;
    }
}
