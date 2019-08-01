import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class EffectIndexDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/effectIndexDefinitions";
        this.removeRouter = "admin/effectIndexDefinitions";
        this.updateRouter = "admin/effectIndexDefinitions";
        this.getRouter = "admin/effectIndexDefinitions";
        this.queryRouter = "admin/effectIndexDefinitions";
    }
    /**
     * 获取下拉相关数据
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryEffectList(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/effectIndexDefinitions/show/new`;
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
     public updateEffectSel(data?: any): Promise<any> {
        let url = `${this.baseUrl}/admin/effectIndexDefinitions`;
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
        let url = `${this.baseUrl}/admin/effectIndexDefinitions`;
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
    public deleteEffect(data: any): Promise<any> {
        let url = `${this.baseUrl}/admin/effectIndexDefinitions/` + data;
        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }
    /**
     * 查询已经添加的table列表
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryEffectSel(data?: any): Promise<any> {
        let queryParams = "";
        if(data){
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/admin/effectIndexDefinitions/rows` + queryParams;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取指标列表
     */
    public queryQwnDefinitions(): Promise<any> {
        let url = `${this.baseUrl}/${this.queryRouter}/query/own`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}