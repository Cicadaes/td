import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class FunnelSeeService extends CurdService {
    queryEventUrl: string;

    constructor(private injector: Injector) {
        super(injector);
        this.queryEventUrl = this.reportBaseUrl + '/behaviorAnalysis/dictionarys/' + this.productId + '?sort=dic_item_alias&order=asc&dicKey=';
    }

    // 废弃
    queryChartData(params: any) {
        const url = this.reportBaseUrl + '/funnelReport/chartData';
        return this.http.post(url, params).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 过滤
     */
    getFilter() {
        const configUrl: any = this.reportBaseUrl + '/behaviorAnalysis/profilemetas/' + this.productId + '?displayType=Tag';
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    getFilterValue($param: any) {
        const configUrl: any = '/reportservice/behaviorAnalysis/dictionarys/' + $param.productId + '?dicKey=' + $param.propValue;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 图表
     */
    getChartData($param: any) {

        let p = {
            funnelId: $param.funnelId,
            productId: $param.productId,
            startDate: $param.date[0].getTime(),
            endDate: $param.date[1].getTime(),
            queryFilters: $param.advanced || []
        };

        const configUrl: any = this.reportBaseUrl + '/funnelReport/chartData';
        return this.http.post(configUrl, p).pipe(
            catchError(this.handleError)
        );

    }

    _checkEventFilter(value: string, propSelect: any) {
        let eventFilter = false;
        if (value && propSelect && propSelect.length > 0) {
            for (let i = 0; i < propSelect.length; i++) {
                const option = propSelect[i];
                const values = option.value;
                if (!eventFilter && values && values.length > 0) {
                    for (let j = 0; j < values.length; j++) {
                        if (option.label === '事件属性' && value === values[j].value) {
                            eventFilter = true;
                            break;
                        }
                    }
                }
            }
        }
        return eventFilter;
    }

    getChartData_advanced($filter: any) {

        if ($filter.advanced) {
            let eventFilter = false;
            if ($filter.propValue && $filter.propValue.groupKey === '事件属性') {
                eventFilter = true;
            }
            return [
                {
                    clauses: 'and',
                    eventFilter: eventFilter,
                    filter: $filter.propValue['value'],
                    operator: $filter.propOperatorValue,
                    values: $filter.propValueValue || [],
                }
            ];

        } else {
            return [];
        }

    }

}
