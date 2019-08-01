import { Interceptor, InterceptedRequest, InterceptedResponse } from 'ng2-interceptors';
import { Injectable } from '@angular/core';
import { XHRBackend, RequestOptions, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { CommonService } from './common.service';
import { CmMessageService } from 'ng-cosmos-td-ui';

@Injectable()
export class ServerURLInterceptor implements Interceptor {
  // Interceptor for request
  constructor(
    private commonService: CommonService,
    private cmMessageService: CmMessageService
  ) { }

  public interceptBefore(request: InterceptedRequest): InterceptedRequest {
    // Do whatever with request: get info or edit it
    this.commonService.displayLoader(true);
    const type = request.options.headers.get('Content-type');
    if (!type) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      request.options.headers = headers;
    } else {
      // 如果存在headers 则不需要加headers
      request.options.headers = null;
    }
    // console.log('==>> intreceptBefore', request);
    return request;

  }

  // Interceptor for response
  public interceptAfter(response: InterceptedResponse): InterceptedResponse {
    // Do whatever with response: get info or edit it
    this.commonService.displayLoader(false);
    // console.log('==>> intreceptAfter', response);
    // 如果是200
    const data = JSON.parse(response.response['_body']);
    if(response.response['status'] === 200 && data.code !== 200) {
      this.cmMessageService.error(data['message'] || '服务器错误', {
        nzDuration: 3000,
      });
    }
    return response;
  }
}
