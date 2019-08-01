import {CRUDService} from "../crud.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class EdmPromotionService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.getRouter = "campaign/edmReachReports";
        this.saveRouter = "campaign/edmReachReports";
        this.removeRouter = "campaign/edmReachReports";
        this.updateRouter = "campaign/edmReachReports";
        this.queryRouter = "campaign/edmReachReports";
    }

    /**
     * 获取时间轴
     * @param segmentId
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getTimeline(segmentId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/timeaxis/${segmentId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 获取投放概览和趋势分析
     * @param segmentId
     * @param lastTime
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getOverviewAndTrend(segmentId: number,statisticsDate: any,granularity: string): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/report/${segmentId}?statisticsDate=${statisticsDate}&granularity=${granularity}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}