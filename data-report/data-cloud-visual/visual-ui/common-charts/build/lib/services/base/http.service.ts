/**
 * Created by wangshouyun on 2017/3/8.
 */
import {AHttp} from "./http.abstract";
import {HttpHeader} from "./http.header";

export class HttpService extends AHttp {

    public header: HttpHeader = new HttpHeader({'Content-Type': 'application/json'});

    public get(url: string, params?: any, header?: HttpHeader): Promise<any> {

        let xmlHttp: any = this.getXmlHttp();
        let queryParams: string = "";
        if (params) {
            queryParams = "?" + this.getParams(params);
        }
        if (header) {
            for (let key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }

        let promise = new Promise((resolve, reject) => {
            xmlHttp.open("GET", url + queryParams, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                } else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send();
        });

        promise.catch(error => {
            this.errorHandler(error);
        });

        return promise;
    }

    public post(url: string, body?: any, header?: HttpHeader): Promise<any> {

        let xmlHttp: any = this.getXmlHttp();
        let bodyData: string = null;
        if (body) {
            bodyData = JSON.stringify(body);
        }
        if (header) {
            for (let key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }

        let promise = new Promise((resolve, reject) => {
            xmlHttp.open("POST", url, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                } else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send(bodyData);
        });

        promise.catch(error => {
            this.errorHandler(error);
        });

        return promise;
    }

    public put(url: string, body?: any, header?: HttpHeader): Promise<any> {

        let xmlHttp: any = this.getXmlHttp();
        let bodyData: string = null;
        if (body) {
            bodyData = JSON.stringify(body);
        }
        if (header) {
            for (let key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }

        let promise = new Promise((resolve, reject) => {
            xmlHttp.open("PUT", url, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                } else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send(bodyData);
        });

        promise.catch(error => {
            this.errorHandler(error);
        });

        return promise;
    }

    public delete(url: string, id: number, header?: HttpHeader): Promise<any> {

        let xmlHttp: any = this.getXmlHttp();

        if (header) {
            for (let key in header) {
                xmlHttp.setRequestHeader(key, header[key]);
            }
        }

        let promise = new Promise((resolve, reject) => {
            xmlHttp.open("PUT", url + "/" + id, true);
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    resolve(xmlHttp.responseText);
                } else if (xmlHttp.status != 200) {
                    reject(xmlHttp.status);
                }
            };
            xmlHttp.send();
        });

        promise.catch(error => {
            this.errorHandler(error);
        });

        return promise;

    }

    public errorHandler(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }

}