import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class UserConfiguredTagService extends CurdService {
    queryTagCategoryUrl: string;
    constructor(private injector: Injector) {
        super(injector);
        this.queryTagCategoryUrl = this.crowdApiBaseUrl + '/tag/tagCategory/tree/query';
    }

    add(params: any) {
        const url = this.crowdApiBaseUrl + '/userProfileManager/save';
        return this.http.post(url, params);
    }

    update(params: any) {
        const url = this.crowdApiBaseUrl + '/userProfileManager/update';
        return this.http.post(url, params);
    }

    query(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/query';
        return this.http.post(url, params);
    }

    calcuteTag(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/' + params.id + '/restartCalc';
        return this.http.get(url);
    }

    deleteTag(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/' + params.id + '/delete';
        return this.http.get(url);
    }

    deleteBatchTags(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/batch/delete';
        return this.http.post(url, params);
    }

    moveBatchTags(params: any, tagCate: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/p/' + this.productId + '/c/' + tagCate.id + '/move';
        return this.http.post(url, params);
    }

    checkDeleteTags(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/batch/delete/check';
        return this.http.post(url, params);
    }

    checkEditTag(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/operator/one/check';
        return this.http.post(url, params);
    }

    checkCreateTags(params: any) {
        const url = this.crowdApiBaseUrl + '/tag/customTags/p/' + this.productId + '/create/check';
        return this.http.post(url, params);
    }
}

