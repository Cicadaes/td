import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";


@Injectable()
export class PushReachReports extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/pushReachReports";
        this.removeRouter = "campaign/pushReachReports";
        this.updateRouter = "campaign/pushReachReports";
        this.getRouter = "campaign/pushReachReports";
        this.queryRouter = "campaign/pushReachReports";
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

    //pipeline接口开始
    /**
     * 获取投放效果报告列表数据
     * @param pipeLineId
     * @param pipeLineNodeId
     * @param data
     */
    public getPipeLineTableList(pipeLineId: number, pipeLineNodeId: number, data?: any): Promise<any> {
        let queryParams: string = "";
        if (data) {
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.getRouter}/segment/${pipeLineId}/${pipeLineNodeId}${queryParams}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 获取投放效果报告折线图数据
     * @param pipeLineId
     * @param pipeLineNodeId
     * @param data
     */
    public getPipeLineTrendList(pipeLineId: number, pipeLineNodeId: number, data: any): Promise<any> {
        let queryParams: string = "";
        queryParams = "?" + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/trend/${pipeLineId}/${pipeLineNodeId}${queryParams}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }
}