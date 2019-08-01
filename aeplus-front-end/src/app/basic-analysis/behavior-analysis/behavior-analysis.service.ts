import {Injectable, Injector} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {CurdService} from '../../curd.service';

@Injectable()
export class BehaviorAnalysisService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
        this.baseUrl = '/reportservice';
    }

    getEventList(params: any) {
        let url = `${this.baseUrl}/behaviorAnalysis/dictionarys/${this.productId}`;
        const quertParams = this.getParams(params);
        url = url + quertParams;
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    getProvince() {
        let url = `${this.baseUrl}/behaviorAnalysis/profilemetas/${this.productId}`;
        url += '?displayType=Tag&showAll=true&shieldEvent=true&sort=dic_item_alias&order=asc';
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    getProfilemetasList(eventId: number) {
        const url = `${this.baseUrl}/behaviorAnalysis/profilemetas/${this.productId}?eventId=${eventId}`;
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    // 占时不使用
    getProfilemetasEventList() {
        const url = `${this.baseUrl}/behaviorAnalysis/dictionarys/${this.productId}?dicKey=eventid`;
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    search(body: any) {
        const url = `${this.baseUrl}/behaviorAnalysis/chartData`;
        return this.http.post(url, body).pipe(
            catchError(this.handleError)
        );
    }

    download(body: any) {
        const url = `${this.baseUrl}/exportJob/export`;
        return this.http.post(url, body).pipe(catchError(this.handleError));
    }
}
