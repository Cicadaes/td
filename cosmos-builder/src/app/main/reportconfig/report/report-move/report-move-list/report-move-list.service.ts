import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CRUDService } from "../../../../../service/crud.service";
import { Http } from "@angular/http";
@Injectable()
export class ReportMoveListService extends CRUDService {

    private grabbleSource = new Subject<any>();
    private check = new Subject<any>();
    missionGrabble$ = this.grabbleSource.asObservable();
    missionCheck$ = this.check.asObservable();
    constructor(public http: Http) {
        super(http);
        this.queryRouter = "reportFolders/rows";//列表查询
    }
    changeCheck(isCheck:boolean) {
        this.check.next(isCheck);
    }
    homeValue(value: any) {
        this.grabbleSource.next(value);
    }

}