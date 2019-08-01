import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {CRUDService} from "./crud.service";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService extends CRUDService {
    constructor(public http: Http) {
        super(http);
    }

    /**
     * 获取登录用户的详细信息
     */
    public getUserInfo(): Promise<any> {
        let url = "";
        if (environment.production) {
            url = `/report-api/user/info`;
        } else  {
            url = `/report-api/user/info`;
        } 
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 登出
     */
    public logout(): Promise<any> {
        let url = "";
        if (environment.production) {
            url = `/report-api/user/logout`;
        } else  {
            url = `/report-api/user/logout`;
        }
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }
}