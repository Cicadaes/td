import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportAdvancedSearchService {
    // 监听搜索
    private grabbleSource = new Subject<any>();

    missionGrabble$ = this.grabbleSource.asObservable();

    homeValue(value: any) {
        this.grabbleSource.next(value);
    }

    // 监听移动
    private moveReport = new Subject<any>();

    missionMoveReport$ = this.moveReport.asObservable();

    moveReportOK(type:any) {
        // console.log(type)
        this.moveReport.next();
    }

   
}