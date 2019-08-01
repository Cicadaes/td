import {BaseCommunicationService} from "../base.communication.service";
import { DialogData } from '../../common/dialog/dialog_data.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from 'primeng/primeng';
/**
 * Created by wangshouyun on 2017/1/5.
 */

@Injectable()
export class DialogCommunicationService extends BaseCommunicationService{
    // Observable string sources
    private missionMessageSource = new Subject<Message>();
    private missionDialogSource = new Subject<DialogData>();

    // Observable string streams
    missionMessage$ = this.missionMessageSource.asObservable();
    missionDialog$ = this.missionDialogSource.asObservable();

    /** 弹出消息 */
    addMessage(msg: Message) {
        this.missionMessageSource.next(msg);
    }
    /** 弹出对话框 */
    showDialog(dialogData: DialogData) {
        this.missionDialogSource.next(dialogData);
    }

}
