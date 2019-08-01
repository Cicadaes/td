import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class FunnelStepDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/funnelStepDefinitions";
        this.removeRouter = "admin/funnelStepDefinitions";
        this.updateRouter = "admin/funnelStepDefinitions";
        this.getRouter = "admin/funnelStepDefinitions";
        this.queryRouter = "admin/funnelStepDefinitions";
    }
}