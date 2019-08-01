import { Injectable } from '@angular/core';
import { BaseCommunicationService } from "../base.communication.service";
import { Subject } from "rxjs/Subject";

@Injectable()
export class CampaignDetailExceptionalCommunication extends BaseCommunicationService {
    //该service用于报错是传递错误信息使用
    private missionExceptionalSource = new Subject<any>();

    missionExceptional$ = this.missionExceptionalSource.asObservable();

    exceptionalMission(data: any) {
        this.missionExceptionalSource.next(data);
    }
}