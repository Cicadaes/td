import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CampaignTargetConfigResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/campaignTargetConfigs";
        this.removeRouter = "campaign/campaignTargetConfigs";
        this.updateRouter = "campaign/campaignTargetConfigs";
        this.getRouter = "campaign/campaignTargetConfigs";
        this.queryRouter = "campaign/campaignTargetConfigs";
    }

    /**
     * 获取计划目标列表
     */
    public getTargetList(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/campaignId/${id}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 获取监测指标列表
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getTarget(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/target`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 删除活动的计划目标
     * @param id
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public removeTarget(data: any): Promise<void> {
        var queryParams: string = "";
        if (data) {
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.removeRouter}/delete`+queryParams;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    /**
     * 更新活动的计划目标
     * @param id
     * @param data
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public updateTarget(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/save`;
        return this.http 
            .post(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(() => data)
            .catch(this.handleError);
    }

    /**
     * 获取监测指标预期达成列表
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getTargetExpectList(id:number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}/target/expect`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}