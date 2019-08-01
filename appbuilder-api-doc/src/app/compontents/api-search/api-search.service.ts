import { Injectable, Injector } from '@angular/core';
import { CurdService } from 'src/app/common/services/crud.service';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiSearchService extends CurdService {
    baseUrl = '/apimanager-api';

    constructor(private injector: Injector) {
        super(injector);
    }

    // 获取接口列表
    getInterfaceList(params: any) {
        const str = this.getParams(params);
        return this.http.get(`${this.baseUrl}/meta/metas/rest` + str).pipe(
            catchError(this.handleError)
        );
    }

    getParams(params: any): string {
        const arr = [];
        for (const name in params) {
            if (true) {
                arr.push(name + '=' + encodeURIComponent(params[name]));
            }
        }
        return '?' + arr.join('&');
    }
}
