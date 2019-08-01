import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class EventMgtService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);

    }

    /**
     * 主组件服务
     */
    post_getEventTypeList() {
        let param = {
            productid: this.productId
        };
        const configUrl: any = '/reportservice/systemManager/getEventTypeList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    post_getAppVersionList(eventTypeValue: any) {
        const param = {
            productid: this.productId,
            eventtype: eventTypeValue
        };
        const configUrl: any = '/reportservice/systemManager/getAppVersionList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    post_getEventList($param: any) {
        const param = {
            productid: $param.productId,
            eventname: $param.eventNameValue && $param.eventNameValue.trim(),
            eventtype: $param.eventTypeValue,
            version: $param.appVersionValue,
            page: $param.pageIndex,
            rows: $param.pageSize,
            status: $param.status
        };
        const configUrl: any = '/reportservice/systemManager/getEventList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    post_updateEvent($param: any) {
        let param = {
            productid: $param.productId,
            eventid: $param.id,
            eventalias: $param.displayName && $param.displayName.trim(),
            status: $param.status
        };
        const configUrl: any = '/reportservice/systemManager/updateEvent';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 事件属性对话框组件服务
     */
    req_getEventAttrList($param: any) {
        const param = {
            productid: $param.productId,
            eventid: $param.id,
            page: $param.pageIndex,
            rows: $param.pageSize
        };
        const configUrl: any = '/reportservice/systemManager/getEventAttrList';
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

}
