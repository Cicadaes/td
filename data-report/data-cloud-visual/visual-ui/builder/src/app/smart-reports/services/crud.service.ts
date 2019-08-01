/**
 * Created by wangshouyun on 2016/12/29.
 */

import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {BaseCRUDService} from "./basecrud.service";

export class CRUDService extends BaseCRUDService {

    constructor(public http: Http) {
        super(http);
        //数炫serviceHost
        window['TD'] = window['TD'] || {};
        window['TD'].DezzleHosts = '';
        if (process.env.ENV == "developer_report") {
            window['TD'].DezzleHosts = `http://172.23.6.2:3006`;
        } else if (process.env.ENV == "production") {
            window['TD'].DezzleHosts = `http://172.23.6.2:3006`;
        } else if (process.env.ENV == "test") {
            window['TD'].DezzleHosts = `http://172.23.6.4:3006`;
        } else if (process.env.ENV == "test_server") {
            window['TD'].DezzleHosts = `http://172.23.6.4:3006`;
        }
    }

    protected redirect(paramas: string): Promise<any> {
        this.queryRouter = paramas
        let p = new Promise((resolve, reject) => {
            this.query().then((data: any) => {
                let redirect = data.redirect;
                let service = data.service;
                resolve(document.location.href = service + document.location.origin + redirect + document.location.href);
            }).catch(this.handleError);
        })
        return p;
    }

}
