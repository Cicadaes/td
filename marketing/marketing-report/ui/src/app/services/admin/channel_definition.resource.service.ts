import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class ChannelDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/channelDefinitions";
        this.removeRouter = "admin/channelDefinitions";
        this.updateRouter = "admin/channelDefinitions";
        this.getRouter = "admin/channelDefinitions";
        this.queryRouter = "admin/channelDefinitions";
    }

    /**
     * 获取短信投放渠道
     * channelType: 2、短信   3、邮件
     */
    public getChanelList(channelType: any): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/rows?pageSize=1000&channelType=${channelType}`;
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError)
    }
}