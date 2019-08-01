/**
 * Created by wangshouyun on 2016/12/29.
 */

import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AbstractCRUDService} from "./crud.abstract.service";

export class BaseCRUDService extends AbstractCRUDService {

    public static BASEURL: string;
    public headers: Headers;
    public createRouter: string;
    public removeRouter: string;
    public updateRouter: string;
    public getRouter: string;
    public queryRouter: string;

    constructor(public http: Http) {
        super();
        this.headers = new Headers({
            'Content-Type': 'application/json'
        });
    }

    /*protected pathURL(): Promise<any> {
     let date = new Date();
     let time = date.getTime();
     let pathOrigin = "";
     if (process.env.ENV == "developer") {
     pathOrigin = "http://localhost";
     } else if (process.env.ENV == "production") {
     pathOrigin = "http://172.23.5.177";
     } else if (process.env.ENV == "test") {
     pathOrigin = "http://172.23.5.179";
     }
     return this.http.get(pathOrigin + "/ui/path.json?time=" + time, {headers: this.headers})
     .toPromise()
     .then(response => {
     if (process.env.ENV == "developer") {
     BaseCRUDService.BASEURL = response.json().developer.main;
     } else if (process.env.ENV == "production") {
     BaseCRUDService.BASEURL = response.json().production.main;
     } else if (process.env.ENV == "test") {
     BaseCRUDService.BASEURL = response.json().test.main;
     }
     console.log(BaseCRUDService.BASEURL);
     })
     .catch(this.handleError);
     }*/

    public pathURL(): Promise<any> {
        let date = new Date();
        let time = date.getTime();
        let pathOrigin = "";
        if (process.env.ENV == "developer") {
            pathOrigin = "http://localhost";
        } else if (process.env.ENV == "production") {
            pathOrigin = "http://172.23.5.177";
        } else if (process.env.ENV == "test") {
            pathOrigin = "http://172.23.5.179";
        }
        if (BaseCRUDService.BASEURL != null) {
            let p = new Promise((resolve, reject) => {
                resolve();
            });
            return p;
        }
        return this.http.get(pathOrigin + "/ui/path.json?time=" + time, {headers: this.headers})
            .toPromise()
            .then(response => {
                if (process.env.ENV == "developer") {
                    BaseCRUDService.BASEURL = response.json().developer.main;
                } else if (process.env.ENV == "production") {
                    BaseCRUDService.BASEURL = response.json().production.main;
                } else if (process.env.ENV == "test") {
                    BaseCRUDService.BASEURL = response.json().test.main;
                }
            })
            .catch(this.handleError);
    }

    public create(data: any): Promise<any> {

        let p = new Promise((resolve, reject) => {
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
            }).catch(error => {
                this.handleError(error);
            });
        });

        return p;

    }

    public remove(id: number): Promise<any> {
        let p = new Promise((resolve, reject) => {
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
            }).catch(error => {
                this.handleError(error);
            });
        });

        return p;

    }

    public update(id: number, data: any): Promise<any> {

        let p = new Promise((resolve, reject) => {
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
        });
        return p;
    }

    public get(id: number): Promise<any> {
        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.getRouter}/${id}`;
                resolve(this.http.get(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });
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
                resolve(this.http.get(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    })
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });
        });
        return p;

    }

    public handleError(error: any): Promise<any> {
        //console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
