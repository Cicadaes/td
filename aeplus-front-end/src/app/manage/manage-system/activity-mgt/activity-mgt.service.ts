import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class ActivityMgtService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);

    }

    post_getCampaignList($param: any) {
        const param = {
            productId: $param.productId,
            dicItemAliasOrValue: $param.sourceNameValue && $param.sourceNameValue.trim(),
            page: $param.pageIndex,
            rows: $param.pageSize
        };
        const configUrl: any = '/reportservice/systemManager/getCampaignList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    post_update_activity($param: any) {
        const param = {
            productId: $param.productId,
            id: $param.id,
            dicItemAlias: $param.displayName && $param.displayName.trim(),
            status: $param.status !== undefined ? Number($param.status) : undefined
        };
        const configUrl: any = '/reportservice/systemManager/update';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

}
