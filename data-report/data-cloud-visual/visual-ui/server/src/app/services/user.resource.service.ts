import {BaseResourceService} from "./base.resource.service";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import {BaseCRUDService} from "./basecrud.service";


@Injectable()
export class UserResourceService extends BaseResourceService {

    constructor(public http: Http) {
        super(http);
        this.queryRouter = "user/info";
        this.createRouter = "user/userPassword";
    }

    logout() {
        let url = `${BaseCRUDService.BASEURL}/user/logout`;
        return this.http.get(url, {headers: this.headers})
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

}
