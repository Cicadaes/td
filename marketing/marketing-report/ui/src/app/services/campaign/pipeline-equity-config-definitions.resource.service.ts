import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class PipelineEquityConfigDefinitionResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/pipelineEquityConfigDefinitions";
        this.removeRouter = "campaign/pipelineEquityConfigDefinitions";
        this.updateRouter = "campaign/pipelineEquityConfigDefinitions";
        this.getRouter = "campaign/pipelineEquityConfigDefinitions";
        this.queryRouter = "campaign/pipelineEquityConfigDefinitions";
    } 
}