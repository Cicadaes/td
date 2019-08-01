import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {CRUDService} from "../../../../service/crud.service";
import { environment } from '../../../../../environments/environment.prod';

@Injectable()
export class MetadataStep3ListService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }

        // this.queryRouter = "datasources/rows";
    }

    //获取数据字典
    getDictionary() {
        let url = "";
        if (environment.production) {
            url = `/report-api/config/dicts?page=1&pageSize=9999`;
        } else{
            url = `/report-api/config/dicts?page=1&pageSize=9999`;
        } 
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}