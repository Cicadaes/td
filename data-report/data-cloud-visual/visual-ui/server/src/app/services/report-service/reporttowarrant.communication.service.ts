import {BaseResourceService} from "../base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseCRUDService} from "../basecrud.service";
/**
 * Created by zhaoxue on 2017/2/22.
 */
@Injectable()
export class DatatowarrantCommunicationService extends BaseResourceService {
    private querypushRouter:any;

    // reportUrl:any = "http://medemo.tenddata.com/visual-web";

    constructor(public http: Http) {
        super(http);
        this.queryRouter = "report/privilegeReports/rows";
        this.removeRouter = "report/reports/";
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




}