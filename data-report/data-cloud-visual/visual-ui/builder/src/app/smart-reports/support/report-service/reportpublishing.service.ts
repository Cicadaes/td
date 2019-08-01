import {SchedulerTaskLogModel} from '../report-models/scheduler_task_log.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from 'primeng/primeng';

@Injectable()
export class ReportPublishingCommunicationService {

    dispatcherName:any;

    private missionAddLayerShowSource = new Subject<any>();

    missionAddLayerShowSource$ = this.missionAddLayerShowSource.asObservable();

    private missionPublishingSource = new Subject<any>();
    missionPublishingConfirmed$ = this.missionPublishingSource.asObservable();

    private missionUpdateListConfirmedSource = new Subject<any>();

    // 分页和查询
    private setQueryObjSource = new Subject<any>();
    private changePageSource = new Subject<number>();

    private missionMessageSource = new Subject<any>();

    missionUpdateListConfirmed$ = this.missionUpdateListConfirmedSource.asObservable()
    setQueryObjSource$ = this.setQueryObjSource.asObservable();
    changePageSource$ = this.changePageSource.asObservable();
    missionMessage$ = this.missionMessageSource.asObservable();

    addLayerMission(data:any){
        this.missionAddLayerShowSource.next(data);
    }

    layerConfirmMission(data: SchedulerTaskLogModel) {
        this.missionPublishingSource.next(data)
    }


    setQueryObj(queryObj: any) {
        this.setQueryObjSource.next(queryObj)
    }

    changePage(newPage: number) {
        this.changePageSource.next(newPage)
    }

    addMessage(msg: Message) {
        this.missionMessageSource.next(msg);
    }

    updateList(){
        this.missionUpdateListConfirmedSource.next();
    }

}
