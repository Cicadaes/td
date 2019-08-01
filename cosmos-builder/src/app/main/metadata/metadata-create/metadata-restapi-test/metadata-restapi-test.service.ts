import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { CRUDService } from "../../../../service/crud.service";
import { environment } from '../../../../../environments/environment.prod';

@Injectable()
export class MetadataRestapiService extends CRUDService{
    constructor(public http: Http) {
        super(http);
        if (environment.production) {
            this.baseUrl = "/report-api/metadata";
        } else {
            this.baseUrl = "/report-api/metadata";
        }
        this.saveRouter = "datasources";
    }

      //测试
      test(id:number, data:any){
        let url = `${this.baseUrl}/${this.saveRouter}/${id}/query`;
        return this.http
        .post(url, JSON.stringify(data), {headers: this.headers})
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }
}