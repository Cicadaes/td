import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class UserProfileService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    req_listDetails() {
        const configUrl: any = '/crowd/meta/metaAttribute/listDetails/' + this.productId;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 基本信息
     */
    req_profileDetail(params: any) {
        const configUrl: any = '/crowd/user/query/carbon/userProfile/profileDetail';
        return this.http.post(configUrl, params).pipe(
            catchError(this.handleError)
        );
    }

    req_crowds(params: any) {
        let configUrl: any = '/crowd/user/crowds';
        const quertParams = this.getParams(params);
        configUrl = configUrl + quertParams;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 所属标签
     */
    req_label(params: any) {
        let configUrl: any = this.crowdApiBaseUrl + '/user/parts/tag';
        const quertParams = this.getParams(params);
        configUrl = configUrl + quertParams;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 指标分析
     */
    req_eventDate() {
        const configUrl: any = '/crowd/user/query/carbon/userProfile/eventDate';
        const param = {
            productId: this.productId
        };
        return this.http.post(configUrl, param).pipe(
            catchError(this.handleError)
        );
    }

    req_eventList(params: any) {
        let configUrl: any = '/crowd/user/query/carbon/userProfile/eventList';
        const quertParams = this.getParams(params);
        configUrl = configUrl + quertParams;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    req_eventPropertyList(event: any) {
        const configUrl: any = '/crowd/user/eventPropertyList/' + this.productId + '/' + event;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    req_userEventReport(params: any) {
        const configUrl: any = '/crowd/user/query/carbon/userProfile/userEventReport';
        return this.http.post(configUrl, params).pipe(
            catchError(this.handleError)
        );
    }

    req_eventHistory($param: any) {
        const date1 = $param.dateRange[0];
        const date2 = $param.dateRange[1];
        const configUrl = '/crowd/user/query/carbon/userProfile/eventHistory';
        const params = {
            'accountOffset': $param.accountOffset || null,
            'endDate': this.commonService.getDateStr(date2) || null,
            'offset': $param.offset || null,
            'page': $param.pageIndex || 1,
            'productId': $param.productId,
            'rows': $param.pageSize,
            'startDate': this.commonService.getDateStr(date1) || null,
        };
        return this.http.post(configUrl, params).pipe(
            catchError(this.handleError)
        );
    }

    req_userProfileBehaviorDetails($params: any) {
        const configUrl = '/crowd/user/query/carbon/userProfile/userProfileBehaviorDetails';
        const params = {
            'accountOffset': $params.accountOffset || null,
            'endDate': this.globals.dateFormat($params.dateRange[1], '') || null,
            'eventId': $params.eventId,
            'offset': $params.offset || null,
            'productId': this.productId,
            'startDate': this.globals.dateFormat($params.dateRange[0], '') || null,
            'startTime': $params.startTime || null
        };
        return this.http.post(configUrl, params).pipe(
            catchError(this.handleError)
        );
    }

    req_eventReport($param: any) {
        const date1 = $param.dateRange[0];
        const date2 = $param.dateRange[1];
        const url = '/crowd/user/query/carbon/userProfile/eventReport';
        const params = {
            'accountOffset': $param.accountOffset || null,
            'endDate': this.commonService.getDateStr(date2) || null,
            'offset': $param.offset,
            'productId': $param.productId,
            'startDate': this.commonService.getDateStr(date1) || null
        };
        return this.http.post(url, params).pipe(
            catchError(this.handleError)
        );
    }

}
