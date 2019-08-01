import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SourceMgtService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  post_getSourceList($param: any) {
    const param = {
      productId: $param.productId,
      dicItemAliasOrValue: $param.sourceNameValue && $param.sourceNameValue.trim(),
      page: $param.pageIndex,
      rows: $param.pageSize
    };
    const configUrl: any = '/reportservice/systemManager/getSourceList';
    return this.http.post(configUrl, param).pipe(catchError(this.handleError));
  }

  post_update_source($param: any) {
    const param = {
      productId: $param.productId,
      id: $param.id,
      dicItemAlias: $param.displayName && $param.displayName.trim(),
      status: $param.status !== undefined ? Number($param.status) : undefined,
      dicItemValue: $param.dicItemValue
    };
    const configUrl: any = '/reportservice/systemManager/updatetSource';
    return this.http.post(configUrl, param).pipe(catchError(this.handleError));
  }
}
