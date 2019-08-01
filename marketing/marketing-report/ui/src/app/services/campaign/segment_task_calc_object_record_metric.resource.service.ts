import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

//TODO 废弃当前接口 改为 campaign/pushReachReports

@Injectable()
export class SegmentTaskCalcObjectRecordMetricResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/segmentTaskCalcObjectRecordMetrics";
        this.removeRouter = "campaign/segmentTaskCalcObjectRecordMetrics";
        this.updateRouter = "campaign/segmentTaskCalcObjectRecordMetrics";
        this.getRouter = "campaign/segmentTaskCalcObjectRecordMetrics";
        this.queryRouter = "campaign/segmentTaskCalcObjectRecordMetrics";
    }

    /**
     * 获取投放效果报告列表数据
     * @param segmentId
     * @param date
     */
    public getTableList(segmentId: any, date?: any): Promise<any> {
        let queryParams: string = "";
        if (date) {
           queryParams = "?" + this.getParams(date);
        }
        let url = `${this.baseUrl}/${this.getRouter}/segment/` + segmentId + queryParams; 
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 获取投放效果报告折线图数据
     * @param data
     */
    public getTrendList(data: any): Promise<any> {
        let queryParams: string = "";
        queryParams = "?" + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/trend` + queryParams;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }
}