import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class FunnelAddService extends CurdService {
    queryEventUrl: string;
    queryEventUrl2: string;

    constructor(private injector: Injector) {
        super(injector);
        this.queryEventUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId + '?dicKey=eventid&page=1&rows=20&parentId=';
        this.queryEventUrl2 = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId + '?dicKey=eventid&rows=20&parentId=';
    }

    // 废弃
    getFunnelById(id: any) {
        const configUrl = this.reportBaseUrl + '/funnelReport/get/' + id;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    getStepValue(funnelId: any) {
        const configUrl: any = this.reportBaseUrl + '/funnelReport/get/' + funnelId;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    getStepValue_empty() {

        return {
            eventTypeId: undefined,
            eventId: undefined,
            name: undefined
        };

    }

    getStepSelect_eventType(productId: any) {
        const configUrl: any = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + productId + '?dicKey=eventtype&order=asc';
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    getStepSelect_eventName($param: any) {
        const configUrl: any = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + $param.productId + '?dicKey=eventid&parentId=' + $param.eventTypeId;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    setStepValue($param: any) {
        const a = {};
        let b;

        // 格式化
        a['id'] = $param.funnelId || null;
        a['productId'] = this.productId;
        a['name'] = $param.nameValue;
        const steps = [];
        if ($param.stepValue && $param.stepValue.length > 0) {
            for (let i = 0; b = $param.stepValue[i]; i++) {
                const step = {
                    eventTypeId: b.eventTypeId,
                    eventId: b.eventId,
                    name: b.name || '',
                    funnelReportId: $param.funnelId || null,
                    id: b.id || null
                };
                steps.push(step);
            }
        }
        a['steps'] = steps;

        let configUrl: any = this.reportBaseUrl + '/funnelReport/save';
        // 编辑
        if (a['id']) {
            configUrl = this.reportBaseUrl + '/funnelReport/update';
        }
        return this.http.post(configUrl, a).pipe(
            catchError(this.handleError)
        );
    }

    setStepValue_getSelectLabel($select: any, $value: any) {

        let a, i;

        for (i = 0; a = $select[i]; i++) {

            if (a.value === $value) return a.label;

        }

    }

}
