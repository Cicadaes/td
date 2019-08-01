/**
 * Created by wangshouyun on 2016/12/29.
 */

import 'rxjs/add/operator/toPromise';

export abstract class AbstractCRUDService {

    abstract create(data: any): Promise<any>;

    abstract remove(id: number): Promise<void>;

    abstract update(id: number, data: any): Promise<any>;

    abstract get(id: number, query?: any): Promise<any[]>;

    abstract query(query?: any): Promise<any[]>;

    public getParams(params: any): string {

        let paramString = "";
        for (let key in params) {
            paramString += encodeURI(key) + "=" + encodeURI(params[key]) + "&";
        }

        return paramString.substr(0, paramString.length - 1);
    }

}