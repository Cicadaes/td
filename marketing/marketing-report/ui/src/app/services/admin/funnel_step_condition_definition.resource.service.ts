import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class FunnelStepConditionDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/funnelStepConditionDefinitions";
        this.removeRouter = "admin/funnelStepConditionDefinitions";
        this.updateRouter = "admin/funnelStepConditionDefinitions";
        this.getRouter = "admin/funnelStepConditionDefinitions";
        this.queryRouter = "admin/funnelStepConditionDefinitions";
    }
}