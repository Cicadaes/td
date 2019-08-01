import {BaseCommunicationService} from "./base.communication.service";
import {Subject}    from 'rxjs/Subject';
import { Message } from 'primeng/primeng';
/**
 * Created by wangshouyun on 2017/1/5.
 */

export class UserCommunicationService extends BaseCommunicationService{

    public currentUserName: string // 中文名
    public currentUserFullId: string // 登录名，可能是邮箱
    public currentUserId: string // 登录名，去掉邮箱后缀

    private missionprivilegeConfirmedSource =  new Subject<any>();

    missionprivilegeConfirmed$ = this.missionprivilegeConfirmedSource.asObservable();

    private missionMessageSource = new Subject<Message>();
    private missionUserAfterTreeSource = new Subject<any>();

    // Observable string streams
    missionMessage$ = this.missionMessageSource.asObservable();
    missionUserAfterTreeSource$ = this.missionUserAfterTreeSource.asObservable();

    privilegeConfirmMission(node: any){
        this.missionprivilegeConfirmedSource.next(node);
    }

    /** 弹出消息 */
    addMessage(msg: Message) {
        this.missionMessageSource.next(msg);
    }

    userAfterTreeMission(){
        this.missionUserAfterTreeSource.next();
    }
}