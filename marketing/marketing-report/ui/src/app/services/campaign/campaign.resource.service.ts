import { BaseResourceService } from "../base.resource.service";
import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class CampaignResourceService extends BaseResourceService {
    //该service用于报错是传递错误信息使用
    private missionExceptionalSource = new Subject<any>();

    missionExceptional$ = this.missionExceptionalSource.asObservable();

    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/campaigns";
        this.removeRouter = "campaign/campaigns";
        this.updateRouter = "campaign/campaigns";
        this.getRouter = "campaign/campaigns";
        this.queryRouter = "campaign/campaigns";
    }

    exceptionalMission(data: any) {
        this.missionExceptionalSource.next(data);
    }

    /**
     * 获取列表
     */
    public query(query?: any): Promise<any[]> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/rows` + queryParams;
        return this.http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 修改活动名称
     * @param id
     * @param data
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public updateCampaignName(id: Number, data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/${id}/name`;
        return this.http.patch(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(() => data)
            .catch(this.handleError);
    }

    /**
     * 克隆活动
     * @param id
     * @param data
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public clone(cloneCampaginId: number, data: any): Promise<any> {
        let url = `${this.baseUrl}/campaign/campaign/clone/${cloneCampaginId}`;
        return this.http
            .post(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 更新营销时间
     * @param id
     * @param data
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public updateTime(id: Number, data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/${id}/time`;
        return this.http
            .patch(url, JSON.stringify(data), { headers: this.headers })
            .toPromise()
            .then(() => data)
            .catch(this.handleError);
    }

    /**
     * 获取营销活动当前年的计划完成情况
     */
    public getCurrYearOverview(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/stat`;
        return this.http
            .get(url, { headers: this.headers })
            .toPromise()
            .then(data => data.json())
            .catch(this.handleError);
    }

}