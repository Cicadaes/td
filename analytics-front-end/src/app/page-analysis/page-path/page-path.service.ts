import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { Subject } from 'rxjs';

@Injectable()
export class PagePathService extends CurdService {
  private missionConfirmedSource = new Subject<string>();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  constructor(private injector: Injector) {
    super(injector);
  }
  getQueryDictionarysUrl() {
    const queryDictionarysUrl = `${this.reportBaseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}`;
    return queryDictionarysUrl;
  }

  getQuerySelectGroupUrl() {
    const querySelectGroupUrl = `${
      this.reportBaseUrl
    }/behaviorAnalysis/profilemetas/${this.getProductId()}?displayType=Tag`;
    return querySelectGroupUrl;
  }

  queryPapgePathData(params: any) {
    const url = this.reportBaseUrl + '/pathAnalyze/list';
    return this.http.post(url, params);
  }

  queryAllPages(params: any) {
    const url = this.reportBaseUrl + '/pathAnalyze/pageMappingList';
    return this.http.post(url, params);
  }

  confirmMission(astronaut: any) {
    this.missionConfirmedSource.next(astronaut);
  }
}
