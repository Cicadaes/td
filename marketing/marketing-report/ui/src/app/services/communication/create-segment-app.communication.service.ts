import { BaseCommunicationService } from "../base.communication.service";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CreateSegmentAppCommunicationService extends BaseCommunicationService {
    // 新建投放里面A/B测试时 用于不同message之间的交互
    private missionSelectFlowCountSource = new Subject<any>();

    private validationPushPieceSource = new Subject<any>(); //校验A/B测试为空时跳转不同的AB

    private selectAppSource = new Subject<any>();           //切换App

    missionSelectFlowCount$ = this.missionSelectFlowCountSource.asObservable();
    validationPushPiece$ = this.validationPushPieceSource.asObservable();
    selectApp$ = this.selectAppSource.asObservable();

    selectFlowCountMission(count: any) {
        this.missionSelectFlowCountSource.next(count);
    }

    skipPushPieceMission(data: any){
        this.validationPushPieceSource.next(data);
    }

    selectAppMission(){
        this.selectAppSource.next();
    }
}