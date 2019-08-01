import { Component } from '@angular/core';
import { DialogCommunicationService } from "../../services/dialog/dialog.communication.service";
import { DialogData, DialogConfirm } from "./dialog_data.model";
import { Message } from 'primeng/primeng';

@Component({
    selector: 'dialog-data',
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css']
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
    dialogData: DialogData = new DialogData()

    dialogCancel() {
        this.dialogDisplay = false
        if (this.dialogData.onCancel) this.dialogData.onCancel()
    }

    dialogConfirm(confirm: DialogConfirm) {
        this.dialogDisplay = false
        if (confirm.onConfirm) confirm.onConfirm()
    }

}
