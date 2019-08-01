import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

export class CRUDService {

    public headers: Headers;
    public baseUrl: string;
    public saveRouter: string;
    public removeRouter: string;
    public updateRouter: string;
    public chartRouter: string;
    public getRouter: string;
    public queryRouter: string;
    public static that: CRUDService;

    constructor(public http: Http) {
        let token = this.getCookie("x-client-token");
        CRUDService.that = this;
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'x-client-token': token,
        });
        this.baseUrl = "/console-api";
    }

    getCookie(cookieName:any){  
        var cookieStr = document.cookie;  
        var arr = cookieStr.split("; ");  
        var cookieValue = "";  
        for(var i=0;i<arr.length;i++){  
            var temp = arr[i].split("=");  
            if(temp[0]==cookieName){  
                cookieValue = temp[1];  
                break;  
            }  
        }  
        return cookieValue;  
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

    public save(data: any): Promise<any> {
        let url = `${this.baseUrl}/${this.chartRouter}`;
        return this.http
            .post(url, JSON.stringify(data), {headers: this.headers})
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
     * @param data 
     */
    /*public uploadFile(data: any): Promise<any> {
        let url = `${this.baseUrl}/file/upload`;
        return this.http.post(url, data, {})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }*/

    /**
     * 错误处理
     * @param error 
     */
    public handleError(error: any): Promise<any> {
        if (error.status == 401 || error.status == 403) {
            CRUDService.that.redirect(error._body);
            return Promise.reject('登录超时。');
        } else {
            let err: string;
            try {
                let data = error.json();
                if (typeof data == 'object' && data.constructor == Array) {
                    err = data[0];
                } else if (typeof data == 'string' && data.constructor == String) {
                    err = data;
                } else {
                    err = '页面错误，请稍后重试。';
                }
            } catch(e) {
                err = error.message || error;
            }
            return Promise.reject(err);
        }
    }

    protected redirect(url:any): void {
        var obj = JSON.parse(url);
        var _url = obj.service+document.location.origin+obj.redirect + document.location.href;
        document.location.href = _url;
        /*let url = `/datareport/user/login`;
        this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(res => {
                let data = res.json();
                let redirect = data.redirect;
                let service = data.service;
                document.location.href = `${service}${document.location.origin}${redirect}` + document.location.href;
            }).catch(err => {});*/
    }

    /**
     * 将参数转换为get请求的参数
     * @param params 
     */
    public getParams(params: any): string {

        let paramString = "";
        for (let key in params) {
            if(params[key] || ("number" == typeof(params[key]) && params[key] == 0)){
                paramString += key + "=" + params[key] + "&";
            }
        }

        return paramString.substr(0, paramString.length - 1);
    }

    /**
     * 将参数转换为get请求的参数
     * @param params
     */
    public poste(url: string, params: any): Promise<any> {
        return this.http
            .post(url, JSON.stringify(params), {headers: this.headers})
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getUrlParams() {
        const url = document.location.href;
        const params = url.split('?')[1];
        if (!params) {
            return {};
        } else {
            const tempList = params.split('&');
            const json = {};
            for (var i = 0; i < tempList.length; i++) {
                const temp = tempList[i].split('=');
                if (temp.length === 2) {
                    json[temp[0]] = temp[1];
                }
            }
            return json;
        }
    }

}