import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { CurdService } from 'src/app/curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EarlyWarningService extends CurdService {
    warningUrl = 'alarm-api/alarm';
    constructor(private injector: Injector) {
        super(injector);
    }

    /** 预警规则 */
    // 列表查询
    getWarningRule(params: any) {
        const stringParams = this.getParams(params);
        return this.http.get(`${this.warningUrl}/alarmServices` + stringParams).pipe(
            catchError(this.handleError)
        );
    }

    // 状态变更
    changeWarningRule(params: any) {
        return this.http.post(`${this.warningUrl}/statusUpdate`, params).pipe(
            catchError(this.handleError)
        );
    }

    // 克隆
    cloneWarningRule(params: any) {
        return this.http.post(`${this.warningUrl}/alarmServicesCopy`, params).pipe(
            catchError(this.handleError)
        );
    }

    // 删除
    deleteWarningRule(params: any) {
        return this.http.post(`${this.warningUrl}/serviceAlarmCopy`, params).pipe(
            catchError(this.handleError)
        );
    }


    /** 告警历史 */
    getWarningHistory(params: any) {
        const stringParams = this.getParams(params);
        return this.http.get(`${this.warningUrl}/alarmLogJobs` + stringParams).pipe(
            catchError(this.handleError)
        );
    }
}
