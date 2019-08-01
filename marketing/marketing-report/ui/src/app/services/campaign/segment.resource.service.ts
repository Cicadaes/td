import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class SegmentResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/segments";
        this.removeRouter = "campaign/segments";
        this.updateRouter = "campaign/segments";
        this.getRouter = "campaign/segments";
        this.queryRouter = "campaign/segments";
    }

    /**
     * 创建投放
     * @param data
     */
    public create(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/ext`;
        return this.http
            .post(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * getSegmentsList 获取投放列表
     * @param data 存放数据
     */
    public getSegmentsList(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/rows?` + this.getParams(data);
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * getSegments 获取投放列表
     * @param data
     */
    public getSegments(data: any): Promise<any> {
        let queryParams;
        if (data) {
            queryParams = '?' + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.getRouter}/rows` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 设置投放状态
     * @param id 投放Id
     * @param status 投放状态
     */
    public setSegmentsStatus(id: number, status: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}/status/${status}`;
        return this.http.put(url, {}, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
}