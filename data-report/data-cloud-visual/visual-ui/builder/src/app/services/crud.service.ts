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
        if (process.env.ENV == "developer") {
            window['TD'].DezzleHosts = `http://172.23.6.2:3006`;
        } else if (process.env.ENV == "production") {
            window['TD'].DezzleHosts = `http://172.23.6.4:3006`;
        } else if (process.env.ENV == "test") {
            window['TD'].DezzleHosts = `http://172.23.6.4:3006`;
        }
    }

}