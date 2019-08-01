import { DialogData } from './dialog_data.model'
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TreeNode } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
/**
 * Created by wangshouyun on 2017/1/5.
 */

@Injectable()
export class DialogCommunicationService{
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