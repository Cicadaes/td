import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseCRUDService} from "../../services/basecrud.service";


/**
 * Created by zhaoxue on 2017/2/22.
 */
@Injectable()
export class DatasourceCommunicationService extends BaseCRUDService {
    private querysourceRouter: any;
    private querydatatypeRouter: any;
    private querysurfaceRouter: any;
    private querydatasourceRouter: any;
    private querysampleRouter: any;
    private querymetadataRouter: any;
    private querydownloadRouter: any;
    private querydataspecRouter: any;
    private savereportRouter: any;
    private querydataSourceRouter: any;
    private queryadaptersDataRouter: any;
    private testRouter: any;
    private querycubeRouter:any;
    private savedatasourceRouter:any;
    private testdatasourceRouter:any;
    private querydetailRouter:any;
    private updatedatasourceRouter:any;
    private saveSqlCheckRouter:any;
    private querysqlsyntaxRouter:any;
    private queryconnectionsRouter:any;
    private prviewDataRouter:any;
    private previewMetaDataRouter:any;
    private testConnectRouter:any;
    private saveparametersRouter:any;
    constructor(public http: Http) {
        super(http);
        this.queryRouter = "report/dataSources/rows";
        this.removeRouter = "report/dataSources/";
        this.querysourceRouter = "report//dataSourceTypes";
        this.querydatatypeRouter = "report/adapters/";
        this.querysurfaceRouter = "/report/dataSources/tables";
        this.createRouter = "report/dataSources";
        this.updateRouter = "report/dataSources";

        this.querydatasourceRouter = "report/reports/dataSources";
        this.querysampleRouter = "report/dataSources";
        this.querymetadataRouter = "report/dataSources";

        this.querydownloadRouter = "report/dataSources";
        this.querydataspecRouter = "report/dataSources";
        this.savereportRouter = "report/reports/new";

        this.querydataSourceRouter = "report/dataSourceConnections";
        this.queryadaptersDataRouter = "report/adapters";
        this.testRouter = "report/dataSourceConnections/test";

        this.prviewDataRouter="report/dataSourceConnections/previewData"
        this.previewMetaDataRouter="report/dataSourceConnections/previewMetaData"
        this.testConnectRouter="report/dataSourceConnections/test"
        this.querycubeRouter = "report/dataSourceConnections";

        this.savedatasourceRouter = "report/dataSourceConnections";
        this.updatedatasourceRouter = "report/dataSourceConnections"
        this.testdatasourceRouter = "report/dataSourceConnections/test";

        this.querydetailRouter = "report/dataSourceConnections";

        this.saveSqlCheckRouter = "report/dataSourceConnections/validateSql";

        this.querysqlsyntaxRouter = "report/dataSourceConnections";

        this.queryconnectionsRouter = "report/dataSourceConnections/querySql";

        this.saveparametersRouter = "report/dataSourceArguments";
    }

    // 测试连接
    public testConnect(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.testConnectRouter}`;
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


    // 预览数据
    public prviewData(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.prviewDataRouter}`;
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
    //预览元数据
    public previewMetaData(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.previewMetaDataRouter}`;
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
    public querysqlsyntax(id:number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querysqlsyntaxRouter}/${id}` + `/views`;
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

    public querydetail(id:number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querydetailRouter}/${id}`;
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

    // 数据源连接
    public querydataSource(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querydataSourceRouter}` + `?order=desc&orderBy=updateTime`;
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

    public querycube(id:number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querycubeRouter}/${id}` + `/tables`;
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

    // 测试数据源连接
    public testData(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.testRouter}`;
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

    public querydownload(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querydownloadRouter}/${id}` + `/sampleData/download`;
                return this.http.get(url).toPromise()
                    .then(response => {
                        url = `${BaseCRUDService.BASEURL}/${this.querydownloadRouter}/${id}` + `/sampleData/download`;
                        window.open(url, "downtable_empty_iframe")
                    })
            }).catch(error => {
                this.handleError(error);
            });
        })
    }

    public querydataspec(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querydataspecRouter}/${id}` + `/connectionInfo`;
                resolve(this.http.get(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response["_body"];
                        }
                    })
                    .catch(this.handleError));
            }).catch(error => {
                this.handleError(error);
            });
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
            }).catch(error => {
                this.handleError(error);
            });
        })

    }

// 数据源渲染信息
    public queryadaptersData(id: number) {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryadaptersDataRouter}/${id}`;
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

    public querymetadata(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querymetadataRouter}/${id}` + `/columns`;
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

    public querysample(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querysampleRouter}/${id}` + `/sampleData`;
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


    public querydatasource(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querydatasourceRouter}/${id}`;
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

// 数据源类型
    public querysource(query?: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querysourceRouter}`;
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

    public querydatatype(query?: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querydatatypeRouter}` + query;
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


    public querysurface(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.querysurfaceRouter}`;
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

    public update(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.updateRouter}`;
                resolve(this.http
                    .put(url, JSON.stringify(data), {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        return response.json()
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

    public saveparameters(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.saveparametersRouter}`;
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

    public saveSqlCheck(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.saveSqlCheckRouter}`;
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



    public savedatasource(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.savedatasourceRouter}`;
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

    public updatedatasource(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.updatedatasourceRouter}`;
                resolve(this.http
                    .put(url, JSON.stringify(data), {headers: this.headers})
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

    public testdatasource(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.testdatasourceRouter}`;
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

    public queryconnections(data: any): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryconnectionsRouter}`;
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