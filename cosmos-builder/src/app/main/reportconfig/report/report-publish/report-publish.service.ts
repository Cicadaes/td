import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import { CRUDService } from "../../../../service/crud.service";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ReportPublishService extends CRUDService {
    private publishRouter:string;
    private listRouter:string;
    
    constructor(public http: Http) {
        super(http);
        this.publishRouter = "reports/publish";//发布
        this.listRouter = "/report-api/um/apps";//um应用列表
        
    }
    // 监听点击发布
    private publishReport = new Subject<any>();
    missionpublishReport$ = this.publishReport.asObservable();

    ispublishReport(data:any){ 
        this.publishReport.next(data);
    }

    // 监听确认发布
    private publishReportOK = new Subject<any>();
    missionpublishReportOK$ = this.publishReportOK.asObservable();

    ispublishReportOK(data:any){ 
        this.publishReportOK.next(data);
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

     // um列表
     public getList(): Promise<any> {
        let url = `${this.listRouter}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
}