import {BaseResourceService} from "../base.resource.service";
import {Http, Headers } from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseCRUDService} from "../basecrud.service";


@Injectable()
export class StageResourceService extends BaseCRUDService {
    builderRouter: string
    datasourceRouter: string
    chartdataRouter: string
    builderGroupsRouter: string
    builderCateRouter: string
    queryDatasourceRouter: string;

    constructor(public http: Http) {
        super(http);
        this.createRouter = "report/reports";
        this.removeRouter = "report/reports";
        this.updateRouter = "report/reports";
        this.getRouter = "report/reports";
        this.queryRouter = "report/reports";

        this.builderRouter = "report/chartStyleConfigDefinitions";
        this.datasourceRouter = "report/dataSources"
        this.chartdataRouter = "report/dataSources/id/data"
        this.builderGroupsRouter = "report/configDefinitionCateGroups"
        this.builderCateRouter = "report/chartStyleConfigDefinitions/chartCateGroup"
        this.queryDatasourceRouter = "report/dataSources/rows"

    }

    public queryDatasource(query?: any): Promise<any> {

        let queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryDatasourceRouter}` + queryParams;
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

    builder(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = id ? `${BaseCRUDService.BASEURL}/${this.builderRouter}/${id}` : `${BaseCRUDService.BASEURL}/${this.builderRouter}`;
                resolve(this.http.get(url, { headers: this.headers })
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

    builderCate(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = id ? `${BaseCRUDService.BASEURL}/${this.builderCateRouter}/${id}` : `${BaseCRUDService.BASEURL}/${this.builderCateRouter}`;
                resolve(this.http.get(url, { headers: this.headers })
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

    builderGroups(query?: any): Promise<any> {

        let queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }

        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.builderGroupsRouter}` + queryParams;
                resolve(this.http.get(url, {headers: this.headers})
                    .toPromise()
                    .then(response => response.json())
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });
        });
        return p;

    }

    datasource(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = id ? `${BaseCRUDService.BASEURL}/${this.datasourceRouter}/${id}` : `${BaseCRUDService.BASEURL}/${this.datasourceRouter}`;
                resolve(this.http.get(url, { headers: this.headers })
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

    //viewMetaData callBack
    datacb(data: any, api?: string, formData?: boolean): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url;
                if (api) {
                    url = `${BaseCRUDService.BASEURL}/${api}`;
                } else {
                    url = `${BaseCRUDService.BASEURL}/${this.createRouter}`;
                }

                resolve(this.http
                    .post(url, formData ? data : JSON.stringify(data), { headers: formData ? new Headers({}) : this.headers })
                    .toPromise()
                    .then(response => response.json())
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });
        })


    }




}