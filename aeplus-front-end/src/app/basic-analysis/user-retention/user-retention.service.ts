import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {Subject} from 'rxjs';

@Injectable()
export class UserRetentionService extends CurdService {
    private missionConfirmedSource = new Subject<string>();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();
    queryEventTypeUrl: string;
    queryEventUrl: string;
    queryEventPagingUrl: string;

    constructor(private injector: Injector) {
        super(injector);
        this.queryEventTypeUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId
            + '?dicKey=eventtype&page=1&rows=20&order=asc';
        this.queryEventUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId
            + '?dicKey=eventid&page=1&rows=20&parentId=';
        this.queryEventPagingUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId
            + '?dicKey=eventid&rows=20&parentId=';
//    this.queryEventUrl = this.dataServiceBaseUrl + '/report/dict';
    }

    query(params: any) {
        const url = this.dataServiceBaseUrl + '/report/query';
        return this.http.post(url, params);
    }

    download(params: any) {
        const url = this.dataServiceBaseUrl + '/report/download';
        return this.http.post(url, params);
    }
}
