import {StageResourceService} from './../services/stage-service/stage.resource.service';
import {StageService} from './../services/stage.service';
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DialogData, DialogConfirm} from "../common/dialog/dialog_data.model";
import {DialogCommunicationService} from "../common/dialog/dialog.communication.service";

@Component({
    selector: 'smart-header',
    templateUrl: 'header.component.html',
    styles: [`
	    :host/deep/ .datareport_name{
			 width:auto !important;
		 }
	`]
})

export class SmartHeaderComponent implements OnInit {
    private pages: any;
    private screenWidth: any;
    private widthSize: any;
    private heightSize: any;

    constructor(private stageService: StageService,
                private stageResourceService: StageResourceService,
                private dialogCommunicationService: DialogCommunicationService,
                private router: Router) {
        this.pages = this.stageService.stagePages

    }

    ngOnInit() {
        this.screenWidth = document.body.clientWidth;
    }

    saveReports() {
        let bigJson = this.stageService.mergeStageData();
        this.stageResourceService.create(bigJson).then((d: any) => {
            this.dialogCommunicationService.addMessage({severity: 'success', summary: d.msg, detail: ""})

        });
        this.stageService.chartMd5 = this.stageService.getDataMd5(JSON.stringify(this.stageService.StageBaseData));
    }

    changeStatus() {
        if (this.stageService.chartMode) {
            document.getElementById('smartStageBox').className = "smart-stage-box";
            this.stageService.chartMode = false;
            setTimeout(() => {
                this.stageService.StageInstance.preViewModel = false;
            }, 300)
        } else {
            document.getElementById('smartStageBox').className = "smart-stage-box stage-format-margin";
            this.stageService.chartMode = true;
            this.judgeChangeWidth();
            let height = (parseInt(this.heightSize)) + "px";
            (document.querySelector('div[stage-container') as HTMLDivElement).style.height = height;
            setTimeout(() => {
                this.stageService.StageInstance.preViewModel = true;
            }, 300)

        }
    }

    public deleEditbool(): any {
        this.stageService.StageBaseData.stages.forEach((stage: any, index: number) => {
            delete stage.editbool
        });
    }


    judgeChangeWidth() {
        let size: any;
        for (let item of this.stageService.formatData) {
            if (item.code == 'width') {
                this.widthSize = item.value;
                size = ((this.screenWidth - 90) / (parseInt(this.widthSize))).toFixed(2)
                item.value = JSON.stringify(Math.floor(size * (this.widthSize)));
            }
            if (item.code == 'height') {
                this.heightSize = item.value;
                size = ((this.screenWidth - 90) / (parseInt(this.widthSize))).toFixed(2)
                item.value = JSON.stringify(Math.floor(size * (this.heightSize)));
            }
        }
    }

    returnReport() {
        this.deleEditbool();
        let returnMd5 = this.stageService.getDataMd5(JSON.stringify(this.stageService.StageBaseData));
        this.stageService.StageInstance.removeAll();
        if (this.stageService.chartMd5 !== returnMd5) {
            let dialog = new DialogData();
            dialog.icon = "jinggao";
            dialog.title = "离开当前报表";
            dialog.content = `确定离开当前报表？如有更新，离开当前页面前请确保执行了保存操作`;
            let confirm: DialogConfirm = new DialogConfirm();
            confirm.onConfirm = () => {

                this.router.navigateByUrl("/" + process.env.DIST + '/datareport/reportList');
            };
            dialog.confirms.push(confirm);
            this.dialogCommunicationService.showDialog(dialog)
        } else {
            this.router.navigateByUrl("/" + process.env.DIST + '/datareport/reportList');
        }

    }
}