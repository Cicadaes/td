import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../../curd.service';

@Injectable()
export class TargetAchievementService extends CurdService {

    constructor(baseInjector: Injector) {
        super(baseInjector);
    }

    // 查询overview
    getOverview(campaignId: any, segmentIdArr: any) {
        let configUrl: any = '/marketing-api/effect/target/' + campaignId + '/overview';
        if (segmentIdArr) {
            configUrl += '?segmentIdArr=' + segmentIdArr;
        }
        return this.http.get(configUrl);
    }

    // 查询trend
    getTrend(campaignId: any, segmentIdArr: any, targetId: any) {
        let configUrl: any = '/marketing-api/effect/target/' + campaignId + '/trend';
        if (targetId) {
            configUrl += '/' + targetId;
        }
        if (segmentIdArr) {
            configUrl += '?segmentIdArr=' + segmentIdArr;
        }
        return this.http.get(configUrl);
    }

    // 查询detail
    getDetail(campaignId: any, segmentIdArr: any) {
        let configUrl: any = '/marketing-api/effect/target/' + campaignId + '/detail';
        if (segmentIdArr) {
            configUrl += '?segmentIdArr=' + segmentIdArr;
        }
        return this.http.get(configUrl);
    }

    // 查询compareList
    getCompareList(campaignId: any) {
        const configUrl: any = '/marketing-api/campaign/campaigns/' + campaignId + '/pipelines/segments';
        return this.http.get(configUrl);
    }

    // 下载1
    downloadTrend(campaignId: any, campaignName: any, segmentIdArr: any, targetId: any) {
        let configUrl: any = `/marketing-api/effect/target/${campaignId}/trend/${targetId}/download?campaignName=${campaignName}`;
        if (segmentIdArr) {
            configUrl += '&segmentIdArr=' + segmentIdArr;
        }
        return this.http.get(configUrl);
    }

    // 下载2
    downloadDetail(campaignId: any, campaignName: any, segmentIdArr: any) {
        let configUrl: any = `/marketing-api/effect/target/${campaignId}/detail/download?campaignName=${campaignName}`;
        if (segmentIdArr) {
            configUrl += '&segmentIdArr=' + segmentIdArr;
        }
        return this.http.get(configUrl);
    }
}
