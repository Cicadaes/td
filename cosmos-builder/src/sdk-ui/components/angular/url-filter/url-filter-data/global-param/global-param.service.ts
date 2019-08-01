import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GlobalParamService {

    private missionShowModal = new Subject<any>();
    missionShowModal$ = this.missionShowModal.asObservable();

    /**
     * 展示参数配置弹框
     * @param data 
     */
    showModal(data: any) {
        this.missionShowModal.next(data);
    }

}