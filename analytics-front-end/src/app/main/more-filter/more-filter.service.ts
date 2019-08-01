import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MoreFilterService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  getProfilemetasList(queryParams: any) {
    const url = `${this.reportBaseUrl}/behaviorAnalysis/profilemetas/${this.getProductId()}${this.getParams(
      queryParams
    )}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  postProfilemetasList(queryParams: any) {
    const url = `${this.reportBaseUrl}/behaviorAnalysis/queryDictionaryList`;
    return this.http.post(url, queryParams).pipe(catchError(this.handleError));
  }

  getEventList(params: any) {
    let url = `${this.reportBaseUrl}/behaviorAnalysis/dictionarys/${this.getProductId()}`;
    const quertParams = this.getParams(params);
    url = url + quertParams;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
}
