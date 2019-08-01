import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class PageMgtService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);

    }

    post_getPageList($param: any) {
        const param = {
            productId: $param.productId,
            sdkId: $param.platformValue,
            dicItemAliasOrValue: $param.nameValue && $param.nameValue.trim(),
            page: $param.pageIndex,
            rows: $param.pageSize
        };
        const configUrl: any = '/reportservice/systemManager/getPageList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    post_updatePage($param: any) {
        const param = {
            productId: $param.productId,
            id: $param.id,
            dicItemAlias: $param.displayName && $param.displayName.trim()

        };
        const configUrl: any = '/reportservice/systemManager/updatePage';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    getPlatforms(param: any) {
        const configUrl: any = '/reportservice/behaviorAnalysis/queryDictionaryList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

}
