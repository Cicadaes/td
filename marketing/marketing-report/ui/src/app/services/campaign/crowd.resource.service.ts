import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CrowdResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/crowds";
        this.removeRouter = "campaign/crowds";
        this.updateRouter = "campaign/crowds";
        this.getRouter = "campaign/crowds";
        this.queryRouter = "campaign/crowds";
    }

    /**
     * 根据fileId获取csv数据详情
     * @param id
     */
    public getPreciseCrowdIdDv(data: any): Promise<any> {
        let that = this;
        let url = `${that.baseUrl}/${that.getRouter}/accurate/file/stat`;
        return that.http.post(url, data, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(that.handleError);
    }

    /**
     * 根据filedId获取预览信息
     * @param data {uploadUUID: string}
     */
    public getDetail(data: any): Promise<any> {
        let that = this;
        let url = `${that.baseUrl}/${that.getRouter}/accurate/file/preview`;
        return that.http.post(url, data, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(that.handleError);
    }

    /**
     * 获取历史人群列表
     * @param name
     */
    public getPreciseCrowdHistory(data?: any): Promise<any> {
        let queryParams: string = "";
        if(data) {
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/accurate/history` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 查询子人群列表（包含模糊查询）
     * @param data
     */
    public getChildCrowdList(data?: any): Promise<any> {
        let queryParams: string = "";
        if(data) {
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.queryRouter}/sub/rows` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取父人群列表
     */
    public getCrowdList(campaignId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.queryRouter}/parent/campaign/` + campaignId + '/rows';
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    };

    /**
     * 重新计算人群
     * @param crowdId
     */
    public recountCrowd(crowdId: number) : Promise<any> {
        let url = `${this.baseUrl}/campaign/crowds/${crowdId}/recount`;
        return this.http.patch(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 获取变量列表
     * @param crowdId
     */
    public getQuotes(crowdId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/crowd/${crowdId}/quote`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }
    /**
     * 请求下载信息
     * @param crowdId
     */
    public getDownload(crowdId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${crowdId}/download/notice`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res)
        .catch(this.handleError);
    }

    /**
     * 获取looklike人群和场景人群
     * @param crowdTp
     * @param campaignId
     */
    public getOldCrowdList(campaignId: number, data?: any): Promise<any> {
        let queryParams: string = "";
        if(data) {
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.getRouter}/campaign/${campaignId}/rows${queryParams}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 根据searchCrowdName获取looklike人群和场景人群列表
     */
    public searchCrowdList(campaignId: number, data?: any): Promise<any> {
        let queryParams: string = "";
        if(data) {
            queryParams = "?" + this.getParams(data);
        }
        let url = `${this.baseUrl}/${this.getRouter}/campaign/${campaignId}/rows${queryParams}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 获取历史人群信息
     */
    public getCrowdByTp(campaignId: number, crowdTp: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/campaign/${campaignId}/rows?crowdTp=${crowdTp}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 获取人群信息
     */
    public getCrowdDetail(crowdId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${crowdId}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    /**
     * 新建人群
     */
    public CreateCrowd(formData: any): Promise<any> {
        let url = `${this.baseUrl}/campaign/pipelineDefinitions/crowd`;
        return this.http
            .post(url, formData || {}, {})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 创建DMP人群接口（用户运营人群需要使用）
     */
    public createDMPCrowd(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/dmpCrowd`;
        return this.http
            .post(url, data, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch();
    }
}