import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
@Injectable()
export class SmsReachReportResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/smsReachReports";
        this.removeRouter = "campaign/smsReachReports";
        this.updateRouter = "campaign/smsReachReports";
        this.getRouter = "campaign/smsReachReports";
        this.queryRouter = "campaign/smsReachReports";
    }
    /**
     * 根据segmentId获取短信效果报告的时间轴
     * @param segmentId
     */
    public getTimeAxis(segmentId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/timeaxis/${segmentId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
     /**
     * 获取投放概览和趋势分析
     * @param segmentId 
     * @param statisticsDate
     */
    public getLaunchTrend(segmentId: number, statisticsDate: string, granularity: string): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/report/${segmentId}?statisticsDate=${statisticsDate}&granularity=${granularity}`;
         return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    } 
    /**
     * 根据segmentId获取投放名称
     * @param segmentId
     */
    public get(segmentId: number): Promise<any> {
        let url = `${this.baseUrl}/campaign/segments/${segmentId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }    
     /**
     * 根据segmentId获取投放概览
     * @param campaignId
     * @param segments
     */
    public getEffectOverview(data: any): Promise<any> {
        let queryParams: string = "";
        queryParams = "?" + this.getParams(data);
        let url = `${this.baseUrl}/campaign/effect/overview`+ queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    //pipeLine接口开始
    /**
     * 获取投放概览和趋势分析
     * @param pipeLineId 
     * @param pipeLineNodeId 
     * @param data 
     */
    public getPipeLineLaunchTrend(pipeLineId: number, pipeLineNodeId: number, data: any): Promise<any> {
        let queryParams: string = "";
        queryParams = "?" + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/report/${pipeLineId}/${pipeLineNodeId}${queryParams}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 根据pipeLineId获取短信效果报告的时间轴
     */
    public getPipeLineTimeAxis(pipeLineId: number, pipeLineNodeId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/timeaxis/${pipeLineId}/${pipeLineNodeId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}