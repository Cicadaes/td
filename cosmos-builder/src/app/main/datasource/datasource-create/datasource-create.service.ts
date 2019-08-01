import { Injectable } from "@angular/core";

import { CRUDService } from "../../../service/crud.service";
import { Http } from "@angular/http";
import { StoreModule, Store } from 'ng-cosmos-td-common';
import { Observable } from 'rxjs/Observable';
import { environment } from "../../../../environments/environment.prod";
interface AppState { msg: any;}
@Injectable()
export class DatasourceCreateService extends CRUDService {
    hasSaved: boolean = false;
    constructor(public http: Http,private store: Store<AppState>,) {
        super(http);
        //根据不同环境配置不同 URL
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }
        this.saveRouter = "datasources";//保存
        this.updateRouter="datasources";//修改数据
        this.getRouter="datasources";//获取

        this.msg$ = store.select('msg');
        this.msg$.subscribe((data:any) => {
            this.msg = data;
        })
    }
    msg: Object;
    msg$: any;
    public test(data: any): Promise<any> {
        let url = `${this.baseUrl}/testConnect`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }//测试

}
