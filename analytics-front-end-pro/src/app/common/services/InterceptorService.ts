import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {throwError} from 'rxjs/index';
import {catchError, mergeMap} from 'rxjs/operators';
import {NzNotificationService} from 'ng-zorro-antd';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(protected notification: NzNotificationService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token;
        if (localStorage.getItem('token') && localStorage.getItem('token') !== 'undefined') {
            token = localStorage.getItem('token');
        }
        let product_id;
        if (localStorage.getItem('productId') && localStorage.getItem('productId') !== 'undefined') {
            product_id = localStorage.getItem('productId');
        }

        let str = '';
        const url = req.url;
        if (product_id && product_id !== 'undefined' && url.indexOf('productId') === -1
            && url.indexOf('marketing-api/campaign/segments') === -1
            && url.indexOf('marketing-api/file/upload') === -1
            && url.indexOf('marketing-api/campaign/equityConfigs') === -1) {
            if (url.indexOf('?') !== -1) {
                str = '&productId=' + product_id;
            } else {
                str = '?productId=' + product_id;
            }
        }

        const configObj = {};
        if (token) {
            configObj['x-client-token'] = token;
        }
        if (url.indexOf('reportservice/importEventServlet') === -1
            && url.indexOf('marketing-api/file/upload') === -1
            && url.indexOf('marketing-api/config/appConfigs/pem/upload') === -1) {
            configObj['Content-Type'] = 'application/json';
        }

        const authReq = req.clone({
            headers: new HttpHeaders(configObj),
            url: (req.url + str)
        });

        return next.handle(authReq).pipe(
            catchError((res: HttpResponse<any>) => {   // 请求失败处理
//                let url: string = res.url;

                if (url.indexOf('reportservice') === -1 && (res.status === 401 || res.status === 403)) {
                    if (window.parent) {
                        const response = {
                            eventType: 'redirect',
                            eventInfo: {}
                        };
                        window.parent.postMessage(JSON.stringify(response), '*');
                    }
                } else if (res.status !== 200) {
                    this.notification.create('warning', '错误提示', res['message']);
                }

                return throwError(event);
            }));
    }
}
