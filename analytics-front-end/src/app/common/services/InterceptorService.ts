import { Injectable } from '@angular/core';
import {
  HttpHeaders,
  HttpEvent,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { take, map, filter, catchError, switchMap, finalize } from 'rxjs/operators';
import { NzNotificationService, NzMessageService } from 'ng-zorro-antd';
import { AuthService } from './auth.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  constructor(
    protected notification: NzNotificationService,
    private message: NzMessageService,
    private authService: AuthService
  ) {}

  addToken(req: HttpRequest<any>, configObj: any, str: string): HttpRequest<any> {
    return req.clone({
      headers: new HttpHeaders(configObj),
      url: req.url + str
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let product_id;
    let str = '';
    const url = req.url;
    // Other ae parmas
    if (localStorage.getItem('productId') && localStorage.getItem('productId') !== 'undefined') {
      product_id = localStorage.getItem('productId');
    }

    if (
      product_id &&
      product_id !== 'undefined' &&
      url.indexOf('productId') === -1 &&
      url.indexOf('marketing-api/campaign/segments') === -1 &&
      url.indexOf('marketing-api/file/upload') === -1 &&
      url.indexOf('marketing-api/campaign/equityConfigs') === -1
    ) {
      if (url.indexOf('?') !== -1) {
        str = '&productId=' + product_id;
      } else {
        str = '?productId=' + product_id;
      }
    }

    const configObj = {};

    if (
      url.indexOf('reportservice/importEventServlet') === -1 &&
      url.indexOf('marketing-api/file/upload') === -1 &&
      url.indexOf('miniprogram-api/qrcode/uploadTemplate') === -1 &&
      url.indexOf('marketing-api/config/appConfigs/pem/upload') === -1
    ) {
      configObj['Content-Type'] = 'application/json';
    }

    configObj['x-client-token'] = this.authService.getAuthToken();

    return next.handle(this.addToken(req, configObj, str)).pipe(
      map(res => {
        // 后端返回结构不一致（还有返回code情况），5.1.1 判断success值
        if (res['body'] && res['body']['success'] === false) {
          this.message.warning(res['body']['msg']);
        }
        return res;
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              return this.handle400Error(error);
            case 401:
              return this.authService.redirect();
            case 403:
              return this.handle403Error(req, next, str, configObj);
            default:
              // 错误码为5xx
              if (error['status'] && Math.floor(error['status'] / 100) === 5) {
                this.notification.create('warning', '错误提示', '服务异常，请稍候重试');
              }
              return observableThrowError(error);
          }
        } else {
          return observableThrowError(error);
        }
      })
    );
  }

  handle400Error(error) {
    if (error && error.status === 400) {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser();
    }

    return observableThrowError(error);
  }

  handle403Error(req: HttpRequest<any>, next: HttpHandler, str: string, configObj: any) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      // const authService = this.injector.get(AuthService);

      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            // console.log('nt:', newToken);
            this.tokenSubject.next(newToken);
            configObj['x-client-token'] = newToken;
            return next.handle(this.addToken(req, configObj, str));
          }
          // if (status === 403 && !newToken) {
          // const xptk = this.authService.ptk$.subscribe((t: any) => {
          //   if (t) {
          //     console.log('sec:', t);
          //     this.tokenSubject.next(t);
          //     configObj['x-client-token'] = t;
          //     xptk.unsubscribe();
          //     return next.handle(this.addToken(req, configObj, str));
          //   }
          // });
          // }
          // If we don't get a new token, we are in trouble so logout.
          // return this.authService.redirect();
          // fix: You provided 'undefined' where a stream was expected.
          // You can provide an Observable, Promise, Array, or Iterable.
          return [];
        }),
        catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.authService.redirect();
          // return this.logoutUser()
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          configObj['x-client-token'] = token;
          return next.handle(this.addToken(req, configObj, str));
        })
      );
    }
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    return observableThrowError('');
  }
}
