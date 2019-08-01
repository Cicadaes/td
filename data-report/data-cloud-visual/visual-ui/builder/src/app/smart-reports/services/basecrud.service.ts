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
    public routerUrl: any;
    public jsonPath: string;


    constructor(public http: Http) {
        super();
        // BaseCRUDService.BASEURL = 'http://172.23.6.2:9095/visual-web';
        //local test
        // BaseCRUDService.BASEURL = 'http://172.30.119.67:9090/visual-web';
        BaseCRUDService.that = this;
        this.headers = new Headers({
            'Content-Type': 'application/json'
        });
    }

    public pathURL(): Promise<any> {

        let pathOrigin = "";

        if (process.env.ENV.search("developer") != -1) {
            // console.log(process.env.ENV);

            if (process.env.ENV == "developer_report") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "public/config/path_local.json";
            }
            if (process.env.ENV == "developer_server") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "public/config/pathServer.json";
            }
            if (process.env.ENV == "developer") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "public/config/pathReport.json";
            }
        }

        if (process.env.ENV.search("production") != -1) {
            if (process.env.ENV == "production_report") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "public/config/path_local.json";
            }
            if (process.env.ENV == "production_server") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "datacloud-visual/public/config/pathServer.json";
            }
            if (process.env.ENV == "production") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "datacloudUI/public/config/pathReport.json";
            }
        }

        if (process.env.ENV.search("test") != -1) {
            if (process.env.ENV == "test_report") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "public/config/path_local.json";
            }
            if (process.env.ENV == "test_server") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "public/config/pathServer.json";
            }
            if (process.env.ENV == "test") {
                this.routerUrl = window.location.origin;
                this.jsonPath = "/public/config/pathReport.json";
            }
        }

        if (BaseCRUDService.BASEURL != null) {
            let p = new Promise((resolve, reject) => {
                resolve();
            });
            return p;
        }


        return this.http.get(this.routerUrl + "/" + process.env.DIST +  "/" + this.jsonPath, {headers: this.headers})
            .toPromise()
            .then(response => {
                // console.log(process.env.ENV)
                if (process.env.ENV == "developer_report") {
                    BaseCRUDService.BASEURL = response.json().developer.main;
                } else if (process.env.ENV == "production_report") {
                    BaseCRUDService.BASEURL = response.json().production.main;
                } else if (process.env.ENV == "test") {
                    BaseCRUDService.BASEURL = response.json().test.main;
                } else if (process.env.ENV == "test_server") {
                    BaseCRUDService.BASEURL = response.json().test.main;
                }
            })
            .catch(this.handleError);
    }


    public create(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.createRouter}`;
                resolve(this.http
                    .post(url, JSON.stringify(data), {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(this.handleError);

        });

    }

    public remove(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.removeRouter}/${id}`;
                resolve(this.http.delete(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            })
        }).catch(error => {
            this.handleError(error);
        });


    }

    public update(id: number, data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.updateRouter}/${id}`;
                resolve(this.http
                    .put(url, JSON.stringify(data), {headers: this.headers})
                    .toPromise()
                    .then(() => data)
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });

        })

    }

    public get(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.getRouter}/${id}`;
                resolve(this.http.get(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    }));
            }).catch(this.handleError);
        })


    }

    public query(query?: any): Promise<any> {

        let queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryRouter}` + queryParams;
                resolve(this.http.get(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));

            })
        })

    }

    // public handleError(error: any): Promise<any> {
    //     //console.error('An error occurred', error);
    //     return Promise.reject(error.message || error);
    // }
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
        this.queryRouter = paramas;
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
