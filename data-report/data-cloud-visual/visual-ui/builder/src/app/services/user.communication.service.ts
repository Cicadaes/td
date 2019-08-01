import {BaseCommunicationService} from "./base.communication.service";
import {Subject}    from 'rxjs/Subject';
/**
 * Created by wangshouyun on 2017/1/5.
 */

export class UserCommunicationService extends BaseCommunicationService{

    private missionprivilegeConfirmedSource =  new Subject<any>();

    missionprivilegeConfirmed$ = this.missionprivilegeConfirmedSource.asObservable();

    privilegeConfirmMission(node: any){
        this.missionprivilegeConfirmedSource.next(node);
    }
}