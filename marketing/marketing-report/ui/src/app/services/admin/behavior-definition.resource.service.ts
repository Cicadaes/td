import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class BehaviorDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/behaviorDefinitions";
        this.removeRouter = "admin/behaviorDefinitions";
        this.updateRouter = "admin/behaviorDefinitions";
        this.getRouter = "admin/behaviorDefinitions";
        this.queryRouter = "admin/behaviorDefinitions";
    }

    /**
     * 获取事件列表
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
     * 获取用户管家事件列表
     */
    public queryUserTags(query?: any): Promise<any> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/tags` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

}