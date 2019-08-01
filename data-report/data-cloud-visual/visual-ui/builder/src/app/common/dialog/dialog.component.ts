import { Component } from '@angular/core';
import { DialogCommunicationService } from "./dialog.communication.service";
import { DialogData, DialogConfirm } from "./dialog_data.model";
import { Message } from 'primeng/primeng';

@Component({
    selector: 'dialog-data',
    templateUrl: 'dialog.component.html',
    styles: [`
        :host /deep/ .dialog-layer{
            padding: 20px;
            overflow: hidden;
        }

        :host /deep/ .dialog-layer .dialog-icon{
            display: inline-block;
        }

        :host /deep/ .dialog-layer .dialog-icon span{
            font-size: 26px;
        }

        :host /deep/ .dialog-layer .dialog-line{
            line-height: 20px;
            padding-top: 5px;
            color: #657180;
            padding-left: 15px;
            width: 354px;
            font-size: 13px;
            text-align: left;
        }

        :host /deep/ .ui-dialog .ui-dialog-content {
            padding: 0!important;
        }

        :host /deep/ .ui-dialog{
            width: 420px!important;
        }

        :host /deep/ .ui-dialog .ui-dialog-titlebar {
            border-bottom: 0 none!important;
            text-align: left!important;
            padding-top: 20px!important;
            padding-left: 20px!important;
            color: #464c5b;
            line-height: inherit!important;
            height: inherit!important;
            padding-bottom: 5px;
        }

        :host /deep/ .ui-dialog .ui-dialog-titlebar .ui-dialog-title {
            line-height: 20px!important;
            height:  20px!important;
            text-align: left;
            font-weight: bold;
        }

        :host /deep/ .ui-dialog .ui-dialog-buttonpane{
            border-top: 0 none;
            padding-top: 20px;
        }

        :host /deep/ .ui-dialog .ui-dialog-buttonpane button {
            width: 60px!important;
        }
    `]
})
export class DialogComponent {

    msgs: Message[] = [];

    constructor(private communicationService: DialogCommunicationService) {
        communicationService.missionMessage$.subscribe(msg => {
            // 去除重复消息
            for (let i in this.msgs) {
                if (this.msgs[i].summary == msg.summary) {
                    this.msgs.splice(Number(i), 1)
                    break
                }
            }
            this.msgs.push(msg)
        })
        communicationService.missionDialog$.subscribe(dialogData => {
            this.dialogData = dialogData;
            this.dialogDisplay = true
        })
    }

    dialogDisplay: boolean = false
    dialogData: DialogData = new DialogData();

    dialogCancel() {
        this.dialogDisplay = false
        if (this.dialogData.onCancel) this.dialogData.onCancel()
    }

    dialogConfirm(confirm: DialogConfirm) {
        this.dialogDisplay = false
        if (confirm.onConfirm) confirm.onConfirm()
    }

}
