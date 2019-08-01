import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { CRUDService } from "../../../../service/crud.service";
import { environment } from '../../../../../environments/environment.prod';

@Injectable()
export class MetadataStep1ListService extends CRUDService{
    constructor(public http: Http) {
        super(http);
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }
        this.queryRouter = "datasources/rows";
    }

}