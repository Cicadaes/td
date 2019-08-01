import { CampaignModel } from './../../models/campaign/campaign.model';
import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AuthResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.getRouter = "campaign";
        this.queryRouter = "campaign";
    }

    /**
     * 获取用户APP
     */
    public getAppList(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/authApp`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }

    /**
     * 登出
     */
    public logout(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/logout`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }

    /**
     * 获取用户详情
     */
    public getUserInfo(): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/user/info`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }

    /**
     * 修改密码
     */
    public resetPassword(data:any): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/rest/password`;
        return this.http.put(url, data, {headers: this.headers})
        .toPromise()
        .then(res => res)
        .catch(this.handleError)
    }
}