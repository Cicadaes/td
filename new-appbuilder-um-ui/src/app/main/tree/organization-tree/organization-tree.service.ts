import { Component, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CRUDService } from '../../../components/common/services/crud.service';

@Injectable()
export class OrganizationTreeService extends CRUDService {
    logoutUrl = '/console-api/user/logout';
    logout() {
        return this.http.get(this.logoutUrl, { headers: this.headers })
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    constructor(public http: Http) {
        super(http);
    }
}
