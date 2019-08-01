import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class FunnelTableService extends CurdService {
    constructor(private injector: Injector) {
        super(injector);
//        const that = this;
    }

    /**
     * 查询漏斗列表接口
     */
    getFunnelList(params: any) {
        const url = this.reportBaseUrl + '/funnelReport/list';
        return this.http.post(url, params);
    }

    deleteFunnel(funnelId: number) {
        const url = `${this.reportBaseUrl}/funnelReport/delete/${funnelId}`;
        return this.http.delete(url);
    }
}
