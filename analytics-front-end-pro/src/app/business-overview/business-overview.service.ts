import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../curd.service';

@Injectable()
export class BusinessOverviewService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
//        this.baseUrl = '/reportservice/aeReport';
    }

}
