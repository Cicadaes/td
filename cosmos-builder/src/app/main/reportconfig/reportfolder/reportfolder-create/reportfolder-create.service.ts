import { Injectable } from "@angular/core";
import { CRUDService } from "../../../../service/crud.service";
import { Http } from "@angular/http";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
interface AppState { msg: any;}
@Injectable()
export class ReportfoldercreateService extends CRUDService {
    constructor(public http: Http,private store: Store<AppState>,) {
        super(http);
        this.saveRouter = "reportFolders";//保存
        this.queryRouter = "reportFolders/rows";//列表查询
    }   
}