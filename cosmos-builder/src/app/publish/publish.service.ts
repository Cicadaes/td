import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { CRUDService } from "../service/crud.service";
import { Http } from "@angular/http";

@Injectable()

export class PublishService extends CRUDService {

    constructor(
        public http: Http,
    ) {
        super(http);
        this.getRouter = "reports/allInfo";//详情页面
    }
}