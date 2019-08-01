import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseCRUDService} from "../basecrud.service";

/**
 * Created by zhaoxue on 2017/2/22.
 */
@Injectable()
export class DatapushCommunicationService extends BaseResourceService {
    private queryAllpowerRouter:any;
    private queryRepotpowerRouter:any;
    private removeReportpowerRouter:any;
    private createReportpowerRouter:any;


    constructor(public http: Http) {
        super(http);
        this.queryRouter = "report/publishReports/rows";
        this.removeRouter = "report/reports/";
        //请求所有权限
        this.queryAllpowerRouter = "report/reports/rolelist";
        //获取当前报表的权限角色
        this.queryRepotpowerRouter = "report/reports";
        //删除当前报表的该角色授权
        this.removeReportpowerRouter = "report/reports";
        //给角色授权当前报表
        this.createReportpowerRouter = "report/reports";
    }

    public createReportpower(id:number,data: any): Promise<any> {
        let p = new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.createReportpowerRouter}/${id}` + `/privilege`;
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

    public queryAllpower(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryAllpowerRouter}`;
                resolve(this.http.get(url, { headers: this.headers })
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    }));
            }).catch(error => {
                this.handleError(error);
            });
        })

    }

    public queryRepotpower(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryRepotpowerRouter}/${id}` + `/privilege`;
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


    public query(query?: any): Promise<any> {

        let queryParams: string = "";
        if (query) {
            queryParams = "?" + this.getParams(query);
        }

        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.queryRouter}` + queryParams;
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

    public removeReportpower(id: number,roleid: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.pathURL().then(() => {
                let url = `${BaseCRUDService.BASEURL}/${this.removeReportpowerRouter}/${id}` + `/privilege/` + `${roleid}`;
                resolve(this.http.delete(url, {headers: this.headers})
                    .toPromise()
                    .then(response => {
                        if (response["_body"]) {
                            return response.json()
                        }
                    }));
            }).catch(error => {
                this.handleError(error);
            });
        })

    }


}