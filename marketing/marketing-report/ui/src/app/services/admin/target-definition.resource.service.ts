import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class TargetDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/campaignTargetDefinitions";
        this.removeRouter = "admin/campaignTargetDefinitions";
        this.updateRouter = "admin/campaignTargetDefinitions";
        this.getRouter = "admin/campaignTargetDefinitions";
        this.queryRouter = "admin/campaignTargetDefinitions";
    }

    /**
     * 获取指标列表
     */
    public query(query?: any): Promise<any> {
        var queryParams: string = "";
        //应后端要求，查询没有删除的数据
        query["statusOperator"] = ">=";
        query["status"] = 0;
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/rows` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    
    /**
     * 获取指标选择下拉
     */
    public queryUserTargets(): Promise<any> {
        let url = `${this.baseUrl}/${this.queryRouter}/show/new`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}