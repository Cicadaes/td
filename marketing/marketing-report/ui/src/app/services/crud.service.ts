/**
 * Created by wangshouyun on 2016/12/29.
 */

import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AbstractCRUDService} from "./crud.abstract.service";

export class CRUDService extends AbstractCRUDService {

    public headers: Headers;
    public baseUrl: string;
    public saveRouter: string;
    public removeRouter: string;
    public updateRouter: string;
    public getRouter: string;
    public queryRouter: string;
    private static that: CRUDService;

    constructor(public http: Http) {
        super();
        CRUDService.that = this;
        this.headers = new Headers({
            'Content-Type': 'application/json'
        });
        if (process.env.ENV == "developer") {
            this.baseUrl = "/marketing-api";
        } else if (process.env.ENV == "production") {
            this.baseUrl = "/marketing-api"     //demo环境
        } else if (process.env.ENV == "test") {
            this.baseUrl = "/marketing-api";
        }
    }


    public create(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.saveRouter}`;
        return this.http
            .post(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    public remove(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.removeRouter}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    public update(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.updateRouter}`;
        return this.http
            .put(url, JSON.stringify(data), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    public get(id: number): Promise<any> {
        let url = `${this.baseUrl}/${this.getRouter}/${id}`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    public query(query?: any): Promise<any[]> {
        var queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let url = `${this.baseUrl}/${this.queryRouter}` + queryParams;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    /**
     * 根据url请求下载（如果有错误，在调用处处理返回）
     * @param url 
     */
    public downloadByUrl(url: any): Promise<any> {
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .catch(this.handleError);
    }

    /**
     * 上传文件，返回文件的uuid
     * uploadFiles为文件
     * type 一方人群(accurate),权益表(equity),短信黑名单(blacklist)
     * @param uploadFiles
     * @param type
     */
    public uploadFile(data: any): Promise<any> {
        let url = `${this.baseUrl}/file/upload`;
        return this.http.post(url, data, {})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    public config(): Promise<any> {
        let url = '/marketing/public/json/config.json';
        return this.http.get(url)
            .toPromise()
            .then((res: any) => {
                if(res) {
                    return res.json()
                } else {
                    return {
                        "dmpDefaultUrl": "http://172.23.5.83"
                    }
                }
            }).catch(this.handleError);
    }

    public handleError(error: any): Promise<any> {
        // console.error('An error occurred', error);
        if (error.status == 401) {
            CRUDService.that.redirect();
            return Promise.reject('');
        } else {
            let err: string;
            try {
                let data = error.json();
                if (typeof data == 'object' && data.constructor == Array) {
                    err = data[0];
                } else if (typeof data == 'string' && data.constructor == String) {
                    err = data;
                } else {
                    err = '页面错误请稍后重试';
                }
            } catch(e) {
                err = error.message || error;
            }
            return Promise.reject(err);
        }
    }

    protected redirect(): void {
        let url = `${this.baseUrl}/cas`;
        this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                let data = res.json();
                let redirect = data.securityUrl;
                let service = data.casServerLoginUrl;
                document.location.href = `${service}?service=${redirect}?spring-security-redirect=` + document.location.href;
            }).catch(err => {});
    }
}