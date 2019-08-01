import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CampaignFunnelConfigResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/campaignFunnelConfigs";
        this.removeRouter = "campaign/campaignFunnelConfigs";
        this.updateRouter = "campaign/campaignFunnelConfigs";
        this.getRouter = "campaign/campaignFunnelConfigs";
        this.queryRouter = "campaign/campaignFunnelConfigs";
    }

    /**
     * 设置默认漏斗接口
     * @param sId  原默认漏斗ID 没有传0
     * @param dId  设置的默认漏斗ID
     */
    public setDefaultFunnel(sId: number, dId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/` + sId + '/' + dId;
        return this.http.put(url, {}, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    /**
     * 根据漏斗和人群获取转换数据
     * @param data {funnelId: 1, crowdIds: 2}
     */
    public getFunnelConvertOverview(data: any): Promise<any> {
        let queryParams = '?' + this.getParams(data);
        let url =`${this.baseUrl}/${this.getRouter}/funnelConvertOverview` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取漏斗详情数据
     * @param funnelId 漏斗id
     * @param data {crowdIds: any[], page: number, pageSize: number}
     */
    public getFunnelDetail(funnelId: number, data: any): Promise<any> {
        let queryParams = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/funnel/` + funnelId + '/detail' + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取漏斗趋势分析折线图
     * @param data 
     *      {
     *          crowdIds: any[],
     *          startStep: number,
     *          endStep: nnumber,
     *          granularity: string 
     *      }
     */
    public getFunnelChart(data: any): Promise<any> {
        let queryParams = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/funnel/trend` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取终点事件累计完成趋势图
     * @param eventId 最后事件ID
     * @param data 
     *      {
     *          campaignId: number,
     *          crowdIds: any[],
     *          granularity: string
     *      }
     */
    public getLastEventChart(eventId: number, data: any): Promise<any> {
        let queryParams = '?' + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/funnel/event/${eventId}/trend${queryParams}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}