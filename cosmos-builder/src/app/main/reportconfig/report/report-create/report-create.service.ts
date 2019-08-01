import { Injectable } from "@angular/core";
import { CRUDService } from "../../../../service/crud.service";
import { Http } from "@angular/http";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
interface AppState { msg: any;}
@Injectable()
export class ReportcreateService extends CRUDService {
    hasSaved: boolean = false;
    constructor(public http: Http,private store: Store<AppState>,) {
        super(http);
        this.saveRouter = "reports";//保存
        this.queryRouter = "reportFolders/rows";//列表查询
    }   

    // 监听文件夹新增
    private createFolder = new Subject<any>();

    missioncreateFolder$ = this.createFolder.asObservable();

    createFolderOK() {
        this.createFolder.next();
    }
}