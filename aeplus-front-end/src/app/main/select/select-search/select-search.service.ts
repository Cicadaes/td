import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class SelectSearchService extends CurdService {
    constructor(private injector: Injector) {
        super(injector);
    }

    getDatas(dataUrl: string, params: any, apiType: string) {
        if (apiType === 'get') {
            const str = this.getDataParams(dataUrl, params);
            return this.http.get(dataUrl + str);
        } else {
            return this.http.post(dataUrl, params);
        }
    }

    // 传参公共方法
    getDataParams(url: string, params: any): string {
        const arr = [];
        for (const name in params) {
            if (true) {
                arr.push(name + '=' + params[name]);
            }
        }
        if (url.indexOf('?') !== -1) {
            return arr.join('&');
        } else {
            return '?' + arr.join('&');
        }
    }

}

