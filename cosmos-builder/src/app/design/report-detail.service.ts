import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ReportDetailService {

    layoutChange$: Observable<any>;

    private layoutChangeSource = new Subject<number>();
    missionLayoutChange$ = this.layoutChangeSource.asObservable();


    layoutChangeMission(layoutChange: any) {
        this.layoutChangeSource.next(layoutChange);
    }
}