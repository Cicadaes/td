import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";

@Injectable()
export class SegmentTaskCalcObjectRecordResourceService extends BaseResourceService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "campaign/segmentTaskCalcObjectRecords";
        this.removeRouter = "campaign/segmentTaskCalcObjectRecords";
        this.updateRouter = "campaign/segmentTaskCalcObjectRecords";
        this.getRouter = "campaign/segmentTaskCalcObjectRecords";
        this.queryRouter = "campaign/segmentTaskCalcObjectRecords";
    }
    
    /**
     * 获取效果报告循环时间
     * @param segmentId
     */
    public getDateList(segmentId: number): Promise<any>{
        let url = `${this.baseUrl}/${this.getRouter}/date/segment/` + segmentId;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    };

    /**
     * 获取pipeLine效果报告循环时间
     * @param pipeLineId
     * @param pipeLineNodeId
     */
    public getPipeLineDateList(pipeLineId: number, pipeLineNodeId: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/date/segment/${pipeLineId}/${pipeLineNodeId}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }
}