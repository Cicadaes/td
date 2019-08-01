import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class UserClickMapService extends CurdService {
    constructor(private injector: Injector) {
        super(injector);
    }

    checkRepeat(params: any) {
        const url = this.reportBaseUrl + '/userProfileManager/checkName';
        return this.http.post(url, params);
    }

    add(params: any) {
        const url = this.reportBaseUrl + '/userProfileManager/save';
        return this.http.post(url, params);
    }

    update(params: any) {
        const url = this.reportBaseUrl + '/userProfileManager/update';
        return this.http.post(url, params);
    }

    query(params: any) {
        const url = this.reportBaseUrl + '/userProfileManager/list';
        return this.http.post(url, params);
    }

    delete(params: any) {
        const url = this.reportBaseUrl + '/userProfileManager/delete';
        return this.http.post(url, params);
    }

}

