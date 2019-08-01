import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class PagePathService extends CurdService {
    private missionConfirmedSource = new Subject<string>();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();
    querySelectGroupUrl: string;
    queryDictionarysUrl: string;

    constructor(private injector: Injector) {
        super(injector);
        this.querySelectGroupUrl = this.reportBaseUrl + '/behaviorAnalysis/profilemetas/' + this.productId + '?displayType=Tag';
        this.queryDictionarysUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId;
    }

    queryPapgePathData(params: any) {
        const url = this.reportBaseUrl + '/pathAnalyze/list';
        return this.http.post(url, params);
    }

    queryAllPages(params: any) {
//    const url = this.reportBaseUrl +  '/pathAnalyze/dictionarys/' + this.productId + '?dicKey=访问页面&searchName=';
        //    return this.http.get(url);
        const url = this.reportBaseUrl + '/pathAnalyze/pageMappingList';
        return this.http.post(url, params);
    }

    confirmMission(astronaut: any) {
        this.missionConfirmedSource.next(astronaut);
    }
}
