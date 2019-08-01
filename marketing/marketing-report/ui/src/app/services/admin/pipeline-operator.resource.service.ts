import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class PipelineOperatorResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "admin/pipelineOperators";
        this.removeRouter = "admin/pipelineOperators";
        this.updateRouter = "admin/pipelineOperators";
        this.getRouter = "admin/pipelineOperators";
        this.queryRouter = "admin/pipelineOperators";
    }

}