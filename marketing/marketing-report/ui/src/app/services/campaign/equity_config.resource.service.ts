import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class EquityConfigResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/equityConfigs";
        this.removeRouter = "campaign/equityConfigs";
        this.updateRouter = "campaign/equityConfigs";
        this.getRouter = "campaign/equityConfigs";
        this.queryRouter = "campaign/equityConfigs";
    }

    /**
     * 根据上传.csv格式权益表获取总量
     * @param bin
     */
    public getTotalEquityByCSVFile(data: any): Promise<any> {
        let that = this;
        let url = `${that.baseUrl}/campaign/equityConfigs/amount`;
        return that.http.post(url, data, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(that.handleError);
    }

    /**
     * 创建一条新的权益
     * @param params
     */
    public createNewEquity(params: any): Promise<any> {
        let that = this;
        let url = `${that.baseUrl}/${that.saveRouter}`;
        return that.http.post(url, params, {})
            .toPromise()
            .then(res => res)
            .catch(that.handleError);
    }

    /**
     * 修改已有的权益
     * @param eqID
     * @param params
     * @param newFormData
     */
    public alterCurEquity(eqID: number, params: any, newFormData: any): Promise<any> {
        let that = this;
        let query: string;
        if(params) {
            query = that.getParams(params);
        }
        let body = newFormData.has('uploadUUID') ? newFormData : null;
        let url = `${that.baseUrl}/${that.updateRouter}/${eqID}?${query}`;
        return that.http.post(url, body, {})
            .toPromise()
            .then(res => res)
            .catch(that.handleError);
    }
}