import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { Subject } from 'rxjs';

@Injectable()
export class UserRetentionService extends CurdService {
  private missionConfirmedSource = new Subject<string>();
  missionConfirmed$ = this.missionConfirmedSource.asObservable();

  constructor(private injector: Injector) {
    super(injector);
  }

  getQueryEventTypeUrl() {
    const queryEventTypeUrl = `${
      this.reportBaseUrl
    }/behaviorAnalysis/dictionarys/${this.getProductId()}?dicKey=eventtype&page=1&rows=20&order=asc`;
    return queryEventTypeUrl;
  }

  getQueryEventPagingUrl() {
    const queryEventPagingUrl = `${
      this.reportBaseUrl
    }/behaviorAnalysis/dictionarys/${this.getProductId()}?dicKey=eventid&rows=20&parentId=`;
    return queryEventPagingUrl;
  }

  query(params: any) {
    const url = `${this.dataServiceBaseUrl}/report/query`;
    return this.http.post(url, params);
  }

  download(params: any) {
    const url = `${this.dataServiceBaseUrl}/report/download`;
    return this.http.post(url, params);
  }
}
