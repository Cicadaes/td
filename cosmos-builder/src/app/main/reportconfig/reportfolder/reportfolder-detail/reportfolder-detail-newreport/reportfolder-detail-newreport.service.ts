import { Injectable } from "@angular/core";
import { CRUDService } from "../../../../../service/crud.service";
import { Http } from "@angular/http";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportfolderDetailNewreportService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "reports";//保存
        this.getRouter = "reportFolders";//详情页面
    }   

    // 监控是否修改
    private grabbleSource = new Subject<any>();

    missionGrabble$ = this.grabbleSource.asObservable();

    updateName(value: any) {
        this.grabbleSource.next(value);
    }
}