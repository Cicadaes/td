import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AnalysisResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/analysis/code";
        this.removeRouter = "campaign/analysis/code";
        this.updateRouter = "campaign/analysis/code";
        this.getRouter = "campaign/analysis/code";
        this.queryRouter = "campaign/analysis/code";
    }

    /**
     * 根据code获取数据
     * @param code number 
     * @param data {campaignId: number, begin: string, end: string}
     */
    public getActualValue(code: number, data: any): Promise<any> {
        let queryRouter = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/${code}` + queryRouter;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 根据code获取饼图数据
     * @param code number 
     * @param data {campaignId: number, begin: string, end: string}
     */
    public getPie(code: number, data: any): Promise<any> {
        let queryRouter = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/${code}/chart` + queryRouter;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    /**
     * 根据code获取渠道对比图
     * @param code number
     * @param data {campaignId: number, begin: string, end: string, topN: number}
     */
    public getComparingTrend(code: number, data: any): Promise<any> {
        let queryRouter = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/${code}/comparing` + queryRouter;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    /**
     * 根据code获取渠道top数量
     * @param code number
     * @param campaignId number
     */
    public getCount(code: number, campaign: number): Promise<any> {
        let queryRouter = '?campaignId=' + campaign;
        let url = `${this.baseUrl}/${this.getRouter}/${code}/count` + queryRouter;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }

    /**
     * 根据code获取趋势图数据
     * @param code number
     * @param data {campaignId: number, begin: string, end: string}
     */
    public getLineData(code: number, data: any): Promise<any> {
        let queryRouter = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/${code}/trend` + queryRouter;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError)
    }
}