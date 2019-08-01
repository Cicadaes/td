import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';

@Injectable()
export class PositionAnalysisService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    countryList(dateParam: any) {
        const configUrl: any = '/crowd/position/countryList';
        const tmpUrl = configUrl + '?startDate=' + dateParam.startDate + '&endDate=' + dateParam.endDate;
        return this.http.get(tmpUrl);
    }

    provinceList(dateParam: any) {
        const configUrl: any = '/crowd/position/provinceList';
        const tmpUrl = configUrl + '?startDate=' + dateParam.startDate + '&endDate=' + dateParam.endDate;
        return this.http.get(tmpUrl);
    }

    getChinaGeo() {
        const configUrl: any = 'assets/china_geo.json';
        return this.http.get(configUrl);
    }

}
