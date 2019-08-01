/**
 * Created by wangshouyun on 2016/12/29.
 */

import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AbstractCRUDService} from "./crud.abstract.service";

export class BaseCRUDService extends AbstractCRUDService {
    private static that: BaseCRUDService;
    public static BASEURL: string;
    public headers: Headers;
    public createRouter: string;
    public removeRouter: string;
    public updateRouter: string;
    public getRouter: string;
    public queryRouter: string;
    routerUrl: any;

    constructor(public http: Http) {
        super();
        BaseCRUDService.that = this;
        this.headers = new Headers({
            'Content-Type': 'application/json'
        });
    }

    public pathURL(): Promise<any> {
        let date = new Date();
        if (process.env.ENV == "developer_server") {
            this.routerUrl = window.location.origin
        } else if (process.env.ENV == "production_server") {
        } else if (process.env.ENV == "test_server") {
            this.routerUrl = window.location.origin + "/"
        }
        if (BaseCRUDService.BASEURL != null) {
            let p = new Promise((resolve, reject) => {
                resolve();
            });
            return p;
        }


        return this.http.get(this.routerUrl + process.env.DIST + "/public/config/pathServer.json", { headers: this.headers })
            .toPromise()
            .then(response => {
                if (process.env.ENV == "developer_server") {
                    BaseCRUDService.BASEURL = response.json().developer.main;
                } else if (process.env.ENV == "production_server") {
                    BaseCRUDService.BASEURL = response.json().production.main;
                } else if (process.env.ENV == "test_server") {
                    BaseCRUDService.BASEURL = response.json().test.main;
                }
            })
            .catch(this.handleError);
    }

    public create(data: any): Promise<any> {

        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.createRouter}`;
                resolve(this.http.post(url, JSON.stringify(data), { headers: this.headers }).toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(this.handleError);
        });

        return p;
    }

    public delete(id: number, params: any): Promise<any> {
        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.removeRouter}/${id}` + params;
                resolve(this.http.delete(url, { headers: this.headers }).toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(this.handleError);
        });

        return p;
    }

    public remove(id: number): Promise<any> {
        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.removeRouter}/${id}`;
                resolve(this.http.delete(url, { headers: this.headers }).toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(this.handleError);
        });

        return p;
    }

    public update(id: number, data: any): Promise<any> {

        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.updateRouter}/${id}`;
                resolve(this.http.put(url, JSON.stringify(data), { headers: this.headers }).toPromise()
                    .then(() => data)
                    .catch(this.handleError));
            }).catch(this.handleError);
        });
        return p;
    }

    public get(id: number): Promise<any> {
        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.getRouter}/${id}`;
                resolve(this.http.get(url, { headers: this.headers }).toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(this.handleError);
        });
        return p;
    }

    public query(query?: any): Promise<any> {
        let queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }
        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryRouter}` + queryParams;
                resolve(this.http.get(url, { headers: this.headers }).toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json();
                        }
                    }));
            }).catch(this.handleError);
        });

        return p;
    }

    protected handleError(error: any): Promise<any> {
        if (error.status == 401) {
            return BaseCRUDService.that.redirect('user/login');
        } else if (error.status == 403) {
            let backToIndexTimer: any
            clearTimeout(backToIndexTimer)
            backToIndexTimer = setTimeout(() => { // 500ms只执行一次
                document.location.href = process.env.DIST
            }, 500)
            // return BaseCRUDService.that.redirect('');
        }
        return Promise.reject(error.message || error);
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
