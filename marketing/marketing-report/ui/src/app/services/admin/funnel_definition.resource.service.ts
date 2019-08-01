import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class FunnelDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/funnelDefinitions";
        this.removeRouter = "admin/funnelDefinitions";
        this.updateRouter = "admin/funnelDefinitions";
        this.getRouter = "admin/funnelDefinitions";
        this.queryRouter = "admin/funnelDefinitions";
    }
}