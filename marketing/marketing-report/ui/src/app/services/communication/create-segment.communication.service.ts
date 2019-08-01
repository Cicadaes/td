import { BaseCommunicationService } from '../base.communication.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CreateSegmentCommunicationService extends BaseCommunicationService {
    //用于表明投放列表已修改 需要请求更新列表
    private missionUpdateTableSource = new Subject<any>();

    missionUpdateTable$ = this.missionUpdateTableSource.asObservable();

    updateTableMission(update: any) {
        this.missionUpdateTableSource.next(update);
    }
}