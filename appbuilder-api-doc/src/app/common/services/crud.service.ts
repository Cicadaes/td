import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-cosmos-ui';
import { throwError } from 'rxjs';

@Injectable()
export class CurdService {

    public static that: CurdService;
    public baseUrl: string;
    public productId: any;
    public urlParams: any;
    token: any;

    protected http: HttpClient;
    protected message: NzMessageService;

    constructor(private baseInjector: Injector) {
        this.http = this.baseInjector.get(HttpClient);
        this.message = this.baseInjector.get(NzMessageService);
        CurdService.that = this;
        this.baseUrl = '/apimanager-api';
    }

    public handleGood = (response: any) => {
        if (response.code === 200) {
            this.message.create('success', '操作成功');
        }
        return response;
    }

    public handleBad = (response: any) => {
        if (response.code !== 200) {
            this.message.create('error', response.message);
        }
        return response;
    }

    /**
     * 错误处理
     * @param error
     */
    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.log('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      }

    /**
     * 传参公共方法
     * @param params
     */
//    encodeURIComponent(params[name])
//    JSON.stringify(params[name])

    public getParams(params: any): string {
        const arr = [];
        for (const name in params) {
            if (params[name] != null) {
                arr.push(name + '=' + params[name]);
            }
        }
        return '?' + arr.join('&');
    }
}
