import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class SelectCustomService extends CurdService {
    constructor(private injector: Injector) {
        super(injector);
    }

    getDatas(dataUrl: string, params: any, apiType: string) {
        if (apiType === 'get') {
            return this.http.get(dataUrl);
        } else {
            return this.http.post(dataUrl, params);
        }
    }
}

