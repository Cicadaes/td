import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {CRUDService} from "../../../../service/crud.service";
import { environment } from '../../../../../environments/environment.prod';

@Injectable()
export class MetadataStep2ListService extends CRUDService {
    constructor(public http: Http) {
        super(http);
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }
        this.queryRouter = "datasources";
    }

    //获取物理表
    getPhysicalTable(id: number,) {
        let url = `${this.baseUrl}/${this.queryRouter}/${id}/physicalMetaObjects`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    //获取物理表字段信息
    getPhysicalAttribute(id: number, name: string) {
        let url = `${this.baseUrl}/${this.queryRouter}/${id}/physicalMetaObjects/physicalMetaAttributes`;
        return this.http.post(url, JSON.stringify({"physicalMetaObjectName": name}), {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}