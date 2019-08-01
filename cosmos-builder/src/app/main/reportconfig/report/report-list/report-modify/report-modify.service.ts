import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CRUDService } from "../../../../../service/crud.service";
import { Http } from "@angular/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReportModifyService extends CRUDService {

    constructor(
        public http: Http
    ) {
        super(http);
        this.updateRouter = "reports";//修改报表
    }

    // 监听编辑
    private updateReport = new Subject<any>();

    missionUpdateReport$ = this.updateReport.asObservable();

    UpdateReport(data: any) {
        this.updateReport.next(data);
    }
}
