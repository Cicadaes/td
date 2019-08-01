import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CampaignLaunchUnitResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/campaignLaunchUnits";
        this.removeRouter = "campaign/campaignLaunchUnits";
        this.updateRouter = "campaign/campaignLaunchUnits";
        this.getRouter = "campaign/campaignLaunchUnits";
        this.queryRouter = "campaign/campaignLaunchUnits";
    }

    /**
     * 新建投放单元
     * @param data
     */
    public createUnit(data: any, formData?: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/ext`;
        return this.http.post(url, data, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取投放单元列表
     * @param id
     */
    public getUnitList(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/campaign/${id}`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 目标达成页获取投放单元列表
     * @param data 对象 存放所有数据
     * @param campaignId  活动ID
     * @param pageSize  建议9999
     */
    public getList(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/rows`;
        let params = '?' + this.getParams(data);
        url = url + params;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取投放单元数据
     * @param id
     */
    public getUnitDetail(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}/crowds`;
        return this.http
        .get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 重新计算
     * @param id
     */
    public recountUnit(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}/recount`;
        return this.http
        .patch(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }
}