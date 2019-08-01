import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import { CRUDService } from "../../../../service/crud.service";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportlistService extends CRUDService {
    private offlineRouter:string;
    private publishRouter:string;
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "reports";//保存
        this.queryRouter = "reports/rows";//列表查询
        this.getRouter = "reports/allInfo";//详情页面
        this.offlineRouter = "reports/offline";//取消发布
        this.publishRouter = "reports/publish";//发布
    }

    public data :any;
    private grabbleSource = new Subject<any>();
    missionGrabble$ = this.grabbleSource.asObservable();

    saveData(data:any,id:any){ 
        let obj = {};
        obj['data'] = data;
        obj['id'] = id;
        this.grabbleSource.next(obj);
    }

    // 取消发布
    public offline(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.offlineRouter}`;
        return this.http
            .post(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    // 发布
    public publish(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.publishRouter}`;
        return this.http
            .post(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    //删除报表
    public remove(id: number): Promise<any> {
        let url = `/report-api/report/reports/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

}