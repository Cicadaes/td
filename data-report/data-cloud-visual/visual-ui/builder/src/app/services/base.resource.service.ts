/**
 * Created by wangshouyun on 2016/12/29.
 */
import {CRUDService} from "./crud.service";
import {Http} from "@angular/http";

export class BaseResourceService extends CRUDService {

    constructor(public http: Http) {
        super(http);
    }
}