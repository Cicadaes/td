import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {Subject} from 'rxjs';

@Injectable()
export class PageHeatmapService extends CurdService {
    private missionConfirmedSource = new Subject<string>();
    missionConfirmed$ = this.missionConfirmedSource.asObservable();
    queryPageUrl: string;

    constructor(private injector: Injector) {
        super(injector);
        this.queryPageUrl = this.reportBaseUrl + '/userProfileManager/list';
    }

    queryHeatmapData(params: any) {
        const url = this.reportBaseUrl + '/heatMap/queryHeatMapData';
        return this.http.post(url, params);
    }

    downloadHeatmapData(params: any) {
        const url = this.reportBaseUrl + '/exportJob/export';
        return this.http.post(url, params);
    }

    confirmMission(astronaut: any) {
        this.missionConfirmedSource.next(astronaut);
    }
}
