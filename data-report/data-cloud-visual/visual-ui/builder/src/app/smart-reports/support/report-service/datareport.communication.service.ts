import {Http } from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseCRUDService} from "../../services/basecrud.service";

/**
 * Created by zhaoxue on 2017/2/22.
 */
@Injectable()
export class DatareportCommunicationService extends BaseCRUDService {
    private savereportRouter:any;
    private updatereportRouter:any;


    constructor(public http: Http) {
        super(http);
        this.queryRouter = "report/reports/rows";
        this.removeRouter = "report/reports/";
        this.createRouter = "report/reports/publish";
        this.savereportRouter = "report/reports/new";
        this.updatereportRouter = "report/reports"
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
                            return response.json();
                        }
                    })
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });
        })

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
            }).catch(error => {
                this.handleError(error);
            });
        })

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
            }).catch(error => {
                this.handleError(error);
            });
        })

    }

    public savereport(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.savereportRouter}`;
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
        })
    }

    public updatereport(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.updatereportRouter}`;
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

   public outline(data: any): Promise<any> {

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
            }).catch(error => {
                this.handleError(error);
            });
        })

    }
}