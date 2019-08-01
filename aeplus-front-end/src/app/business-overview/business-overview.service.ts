import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../curd.service';

@Injectable()
export class BusinessOverviewService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
        this.baseUrl = '/reportservice/aeReport';
    }

    /**
     * 获取"我的报表"列表数据
     * @param body
     * page 页数
     * pageSize 每页条数
     */
    getMyReportList(param?: any) {
        let queryParams = '';
        if (param) {
            queryParams = this.getParams(param);
        }
        const url = `${this.baseUrl}/shareReportlist${queryParams}`;
        return this.http.get(url);
    }

    /**
     * 获取"共享的报表"列表数据
     * @param body
     * page 页数
     * pageSize 每页条数
     */
    getSharingReportList(param?: any) {
        let queryParams = '';
        if (param) {
            queryParams = this.getParams(param);
        }
        const url = `${this.baseUrl}/sharedReportlist${queryParams}`;
        return this.http.get(url);
    }

}
