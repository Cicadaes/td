import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import { CRUDService } from "../../../service/crud.service";
import { environment } from "../../../../environments/environment.prod";

@Injectable()
export class DatasourceDetailService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        //根据不同环境配置不同 URL
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }
        this.getRouter = "datasources";//详情页面
        this.updateRouter = "datasources";//修改
    }
  
}