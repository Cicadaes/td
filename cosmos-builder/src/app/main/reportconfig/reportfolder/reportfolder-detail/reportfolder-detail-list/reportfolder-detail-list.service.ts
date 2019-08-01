import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { CRUDService } from "../../../../../service/crud.service";

@Injectable()
export class ReportfolderDetailListService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.queryRouter = "reports/rows";//列表查询
    }

    //删除报表
    public delete(id: number): Promise<any> {
        let url = `/report-api/report/reports/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
}