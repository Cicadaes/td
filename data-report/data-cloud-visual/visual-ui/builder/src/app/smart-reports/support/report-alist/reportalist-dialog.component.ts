import {Component, OnInit, Input} from '@angular/core';
import {Router} from "@angular/router";
import {DatapushCommunicationService} from "../report-service/reportpush.communication.service";
import {ReportPublishingCommunicationService} from "../report-service/reportpublishing.service";

import {DialogCommunicationService} from "../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../common/dialog/dialog_data.model";
import {isNumber} from "util";

@Component({
    selector: 'reportalist-dialog',
    templateUrl: 'reportalist-dialog.component.html',
    styles: [`
    `]
})

export class ReportalistDialogComponent implements OnInit {
    @Input() config:any;

    display: boolean = false;
    dialogWidth: number = 490;
    taskTitle: any = "新建报表";
    dataName:string;
    dataDesc:string;
    showerrTip:boolean = false;
    errorTip:string;


    constructor(private communication: DatapushCommunicationService,
                private datacauseCommunicationService: ReportPublishingCommunicationService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.datacauseCommunicationService.missionPublishingConfirmed$.subscribe((data:any) =>{
            this.display = true;
            this.showerrTip = false;
        })
    }

    ngOnInit() {

    }





    changeFromName() {
        if (this.dataName == '' || this.dataName == undefined) {
            this.showerrTip = true;
            this.errorTip = "报表名称不能为空";
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
        console.log(this.dataName)
        this.router.navigateByUrl(this.config.url + "/" + this.dataName + "/1")

    }
}
