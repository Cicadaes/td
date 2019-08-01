import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CrowdTaskCalcObjectRecordResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/crowdTaskCalcObjectRecords";
        this.removeRouter = "campaign/crowdTaskCalcObjectRecords";
        this.updateRouter = "campaign/crowdTaskCalcObjectRecords";
        this.getRouter = "campaign/crowdTaskCalcObjectRecords";
        this.queryRouter = "campaign/crowdTaskCalcObjectRecords";
    }
}