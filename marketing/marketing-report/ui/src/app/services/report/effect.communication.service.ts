import {CRUDService} from "../crud.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class EffectService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.getRouter = "campaign/effect";
    }

    /**
     * 获取目标达成数据
     * @param data
     */
    public getEffectOverview(data: any): Promise<any> {
        let queryParams: string = "";
        queryParams = "?" + this.getParams(data);
        let url = `${this.baseUrl}/${this.getRouter}/overview` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
    
    /**
     * 获取总体的趋势分析
     * @param campaignId
     * @param configId
     * @param data
     */
     public getEffectTrend(campaignId: number, configId: number, segments?: any): Promise<any> {
         let queryParams: string = "";
        queryParams = "?segments=" + segments;
        let url = `${this.baseUrl}/${this.getRouter}/campaign/` + campaignId + `/config/` + configId + '/trend' + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取投放目标详情
     * @param campaignId
     */
    public getEffectDetail(campaignId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/campaign/` + campaignId + '/detail';
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

}