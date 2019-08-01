import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class AttachmentResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/attachments";
        this.removeRouter = "campaign/attachments";
        this.updateRouter = "campaign/attachments";
        this.getRouter = "campaign/attachments";
        this.queryRouter = "campaign/attachments";
    }

    /**
     * 上传文件
     */
    public uploadFile(data: any): Promise<any> {
        return this.http
            .post(`${this.baseUrl}/${this.saveRouter}`, data, {})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}