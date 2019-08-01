import {CRUDService} from "../crud.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class FunnelService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.getRouter = "funnel";
        this.saveRouter = "funnel";
        this.queryRouter = "funnel";
    }

    /**
     * 获取趋势图
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public queryChart(query?: any): Promise<any[]> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/chart` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 创建漏斗活动关系表
     * @param data
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    // public createFunnel(data: any): Promise<any> {
    //     let url = `${this.baseUrl}/${this.saveRouter}/create`;
    //     return this.http
    //         .post(url, JSON.stringify(data), {headers: this.headers})
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }

    /**
     * 设置默认漏斗
     * @param data
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public setDefaultFunnel(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/default`;
        return this.http
            .patch(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(() => data)
            .catch(this.handleError);
    }

    /**
     * 获取漏斗事件
     * @param id(漏斗Id)
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getFunnelEvent(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/event?id=`+id;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 获取漏斗信息列表
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getFunnelList(id:any): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}/list`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     *获取漏斗详细信息列表
     * @param query (人群id列表，漏斗id)
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getFunnelDetailList(query?: any): Promise<any[]> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/listdetail` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 获取转换概览
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getFunnelView(query: any): Promise<any> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.getRouter}/view` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    /**
     * 获取流失设备数
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public getLostDv(query?: any): Promise<any> {
    	var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.getRouter}/lostdv` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
    /**
     * 创建漏斗
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public createFunnel(data: any): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelDefinitions/createFunnel`;
        return this.http
            .post(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
    /**
     * 修改漏斗
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public updateFunnel(data: any): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelDefinitions`;
        return this.http.put(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
    /**
     * 删除漏斗
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
    public deleteFunnel(id: number): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelDefinitions/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
    /**
     * 创建漏斗--获取下拉相关数据
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public querySel(data: any): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions?type=`+data;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 创建漏斗--获取页面名称下拉相关数据
     * @param query
     * @returns {Promise<TResult>|Promise<any|any>}
     */
     public queryFunnelSel(data?: any): Promise<any> {
        let queryParams = "";
        if(data){
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/admin/funnelIndexDefinitions/rows` + queryParams;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取漏斗详情
     */
    public queryFunnelDetail(id:number): Promise<any> {
        let url = `${this.baseUrl}/admin/funnelDefinitions/${id}`;
        return this.http
            .get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}