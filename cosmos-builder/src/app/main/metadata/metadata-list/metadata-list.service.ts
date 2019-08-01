import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {CRUDService} from "../../../service/crud.service";
import { environment } from "../../../../environments/environment.prod";

@Injectable()
export class MetadataService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }
        this.saveRouter = "metaObjects";
        this.removeRouter = "metaObjects";
        this.updateRouter = "metaObjects";
        this.getRouter = "metaObjects";
        this.queryRouter = "metaObjects/rows";
    }

    /**
     * 获取元数据详情（未映射的不返回）
     * @param id
     */
    public getMetadataForMapping(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}?showAll=false`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}