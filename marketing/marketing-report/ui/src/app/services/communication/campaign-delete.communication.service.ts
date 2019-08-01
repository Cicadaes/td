import { BaseCommunicationService } from "../base.communication.service";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CampaignDeleteCommunicationService extends BaseCommunicationService {
    // 新建投放里面A/B测试时 用于不同message之间的交互
    private missionDeletCampaign = new Subject<any>();

    deletCampaign$ = this.missionDeletCampaign.asObservable();

    deletCampaignMission(count: any) {
        this.missionDeletCampaign.next(count);
    }

}