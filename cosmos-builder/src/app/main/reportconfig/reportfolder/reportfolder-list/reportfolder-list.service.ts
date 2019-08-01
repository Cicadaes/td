import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import { CRUDService } from "../../../../service/crud.service";

@Injectable()
export class ReportfolderlistService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.saveRouter = "reportFolders";//保存
        this.queryRouter = "reportFolders/rows";//列表查询
        this.getRouter = "reportFolders";//详情页面
        this.updateRouter = "reportFolders";//修改
    }
  
}