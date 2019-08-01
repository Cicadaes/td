import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';

@Injectable()
export class CapacityPathService extends CurdService {
    queryEventPagingUrl: string;

    constructor(private injector: Injector) {
        super(injector);
        this.queryEventPagingUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId + '?dicKey=eventid&rows=20&parentId=';
    }

    queryEventTypes() {
        const url = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId + '?dicKey=eventtype&page=1&order=asc';
        return this.http.get(url);
    }

    query(params: any) {
        const url = this.reportBaseUrl + '/smartPath/query';
        return this.http.post(url, params);
    }

    create(params: any) {
        const url = this.reportBaseUrl + '/smartPath/create';
        return this.http.post(url, params);
    }

    edit(params: any) {
        const url = this.reportBaseUrl + '/smartPath/edit';
        return this.http.post(url, params);
    }

    delete(params: any) {
        const url = this.reportBaseUrl + '/smartPath/delete/' + params.id;
        return this.http.delete(url);
    }

    queryById(params: any) {
        const url = this.reportBaseUrl + '/smartPath/queryById/' + params.id;
        return this.http.get(url);
    }

    recompute(params: any) {
        const url = this.reportBaseUrl + '/smartPath/recompute/' + params.id;
        return this.http.get(url);
    }

    queryResult(params: any) {
        const url = this.reportBaseUrl + '/smartPathResult/query';
        return this.http.post(url, params);
    }
}
