import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class FunnelIndexDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/funnelIndexDefinitions";
        this.removeRouter = "admin/funnelIndexDefinitions";
        this.updateRouter = "admin/funnelIndexDefinitions";
        this.getRouter = "admin/funnelIndexDefinitions";
        this.queryRouter = "admin/funnelIndexDefinitions";
    }
     /**
     * 获取下拉相关数据
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryFunnelList(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions/show/new`;
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
     public updateFunnelSel(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions`;
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
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions`;
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
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions/` + data;
        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }
    /**
     * 查询已经添加数据列表活动状态
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryStatus(id: any): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions/status/${id}`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}