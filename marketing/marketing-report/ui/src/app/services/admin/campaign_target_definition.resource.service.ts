import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CampaignTargetDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/campaignTargetDefinitions";
        this.removeRouter = "admin/campaignTargetDefinitions";
        this.updateRouter = "admin/campaignTargetDefinitions";
        this.getRouter = "admin/campaignTargetDefinitions";
        this.queryRouter = "admin/campaignTargetDefinitions";
    }

    /**
     * 获取下拉相关数据
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryList(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions/show/new`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
    /**
     * 获取下拉相关数据
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryTarList(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions/${data}/unown`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
    /**
     * 提交选择项目
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public updateSel(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions`;
        return this.http
            .post(url,data, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
    /**
     * 提交修改的名称和描述
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public putChange(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions`;
        return this.http
            .put(url,data, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
    /**
     * 删除已提交项目
     * @param delete
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public deleteFunnel(data: any): Promise<any> {
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions/` + data;
        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }
    /**
     * 查询已经添加数据列表
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryCampaign(data?: any): Promise<any> {
         let queryParams = "";
            if(data){
                queryParams = "?" + this.getParams(data);
            }
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions/rows` + queryParams;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
    /**
     * 查询已经添加数据列表活动状态
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryStatus(id: any): Promise<any> {
        let url = `${this.baseUrl}/admin/campaignTargetDefinitions/status/${id}`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}