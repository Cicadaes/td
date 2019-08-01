import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import { Subject } from 'rxjs/Subject';

@Injectable()
export class IndexSerivice extends BaseResourceService {
    //用于判断是否已登录
    constructor(public http: Http) {
        super(http);
    }

    public show: boolean = false;

    public firstRequest(): Promise<any> {
        let url = `${this.baseUrl}/checkCas`
        return this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => {
        }).catch(this.handleError);
    }
}