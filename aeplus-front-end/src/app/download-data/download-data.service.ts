import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../curd.service';

@Injectable()
export class DownloadDataService extends CurdService {
    downloadUrl: string;

    constructor(private injector: Injector) {
        super(injector);
        this.downloadUrl = this.reportBaseUrl + '/exportJob/download';
    }

    queryDatas(params: any) {
        const url = this.reportBaseUrl + '/exportJob/query';
        return this.http.post(url, params);
    }

    updateTempJobretry(params: any) {
        const url = this.reportBaseUrl + '/exportJob/updateTempJobretry';
        return this.http.post(url, params);
    }

}
