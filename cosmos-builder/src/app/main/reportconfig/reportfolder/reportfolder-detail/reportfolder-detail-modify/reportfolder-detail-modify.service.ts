import { Injectable } from "@angular/core";

import { CRUDService } from "../../../../../service/crud.service";
import { Http } from "@angular/http";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
interface AppState { msg: any;}
@Injectable()
export class ReportfolderDetailModifyService extends CRUDService {
    hasSaved: boolean = false;
    constructor(public http: Http,private store: Store<AppState>,) {
        super(http);
        this.updateRouter = "reportFolders";//修改数据
        this.getRouter = "reportFolders";//详情页面
    }
}
