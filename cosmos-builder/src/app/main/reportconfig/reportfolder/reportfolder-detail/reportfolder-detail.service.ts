import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import { CRUDService } from "../../../../service/crud.service";

@Injectable()
export class ReportfolderdetailService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        this.getRouter = "reportFolders";//详情页面
        this.updateRouter = "reportFolders";//修改
        this.removeRouter = "reportFolders";//删除
    }
  
}