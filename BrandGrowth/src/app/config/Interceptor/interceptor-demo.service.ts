import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Config } from './config';
import { CommonService } from './common.service';
import { InterceptorService } from 'ng2-interceptors';

@Injectable()
export class InterceptorDemoService {
  constructor(private http: InterceptorService, private commonService: CommonService) { }

  // FUNCTION TO GET LIST OF ALL USERS
  getAll(name: string = null, page: number = 1) {
    return this.http.post(Config.BASE_API_URL + '/users-list', { name: name, page: page }, {
    })
      .map(this.commonService.extractData)
      .catch(this.commonService.handleError);
  }
}
