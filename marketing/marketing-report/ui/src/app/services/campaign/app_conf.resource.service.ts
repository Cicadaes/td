import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AppConfResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/appConfs";
        this.removeRouter = "campaign/appConfs";
        this.updateRouter = "campaign/appConfs";
        this.getRouter = "campaign/appConfs";
        this.queryRouter = "campaign/appConfs";
    }

    /**
     * 获取app列表
     */
    public getAppList(): Promise<any> {
        let url = `${this.baseUrl}/campaign/appConfigs/list`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }

    /**
     * 获取app
     */
    public getAppByAppId(appId: any): Promise<any> {
        let url = `${this.baseUrl}/campaign/appConfigs/appId/${appId}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }

    /**
     * 新建APP
     */
    public createApp(data: any): Promise<any> {
        let url = `${this.baseUrl}/campaign/appConfigs`;
        return this.http.post(url, JSON.stringify(data), {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }

    /**
     * 上传IOS证书
     * @param data
     * @param appId
     * @param prod   0：开发证书，1：生产证书
     */
    public upload(data: any, appId: string, prod: number): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}/pem/upload/${appId}/${prod}`;
        return this.http
            .post(url, data, {})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * 更新上传安卓第三方通道配置
     * @param data
     * {
     *   app: string //
     *   channel: 0    0 小米 1华为  3 个推 4 极推
     * }
     */
    public updateApp(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/thirdchannel/config`;
        return this.http
            .patch(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    } 

    /**
     * 极光和个推配置清空接口
     * @param appId 
     * @param channel
     * @param data  {
     *    app: string
     * }
     */
    public clearApp(appId: string, channel: number): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}/${appId}/${channel}`;
        return this.http
            .patch(url, '', {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
}