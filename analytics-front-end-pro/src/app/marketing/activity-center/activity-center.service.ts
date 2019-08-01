import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';
import {catchError} from 'rxjs/operators';

@Injectable()

export class ActivityCenterService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    /**
     * 检验活动名称的唯一性
     * @param name
     */
    checkCampaignNameUnique(name: any) {
        const configUrl: any = `/marketing-api/campaign/campaigns/checkCampaignNameUnique/${this.productId}?campaignName=${name}`;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    // 保存活动
    updateCampaigns(body: any) {
        const configUrl: any = '/marketing-api/campaign/campaigns/updateCampaignNameAndDesc';
        return this.http.put(configUrl, body).pipe(
            catchError(this.handleError)
        );
    }

    // /marketing-api/campaign/campaigns/clone/${campaignId} 多触点克隆
    manyDotClon(campaignId: any) {
        return this.http.get(`/marketing-api/campaign/campaigns/clone/${campaignId}`).pipe(
            catchError(this.handleError)
        );
    }

    // /marketing-api/campaign/segments/clone/${campaignId} 单触点克隆
    oneDotClon(segmentId: any) {
        return this.http.get(`/marketing-api/campaign/segments/clone/${segmentId}`).pipe(
            catchError(this.handleError)
        );
    }

    // /marketing-api/campaign/segments/${campaignId} 获取投放列表
    getSegmentList(campaignId: any) {
        return this.http.post(`/marketing-api/campaign/segments/${campaignId}`, {}).pipe(
            catchError(this.handleError)
        );
    }

    // marketing-api/campaign/campaigns 新建多触点
    insertManyDot(parmas: any) {
        return this.http.post(`/marketing-api/campaign/campaigns`, parmas).pipe(
            catchError(this.handleError)
        );
    }

    // marketing-api/campaign/campaigns/clone 多触点克隆新建
    insertManyDotClon(parmas: any) {
        return this.http.post(`/marketing-api/campaign/campaigns/clone`, parmas).pipe(
            catchError(this.handleError)
        );
    }

    // marketing-api/crowd/crowds/${id} 获取目标人群列表
    getCrowdList(crowdId: number) {
        let url = `/marketing-api/crowd/crowds?page=1&pageSize=99999999`;
        if(crowdId){
            url += `&crowdIds=${crowdId}`;
        }
        return this.http.get(url).pipe(
            catchError(this.handleError)
        );
    }

    // /config/channelConfigs/byChannelType/{channelType} 根据渠道类型获取渠道配置列表；
    getConfigByChannelType(type: any) {
        return this.http.get(`/marketing-api/config/channelConfigs/byChannelType/${type}`).pipe(
            catchError(this.handleError)
        );
    }

    // /campaign/segments/single 保存单触点投放
    saveSingleSegment(data: any) {
        return this.http.post(`/marketing-api/campaign/segments/create/${this.productId}`, data).pipe(
            catchError(this.handleError)
        );
    }

    // /campaign/segments/single/update 修改单触点投放
    updateSingleSegment(data: any) {
        return this.http.put(`/marketing-api/campaign/segments/update/${this.productId}`, data).pipe(
            catchError(this.handleError)
        );
    }

    // 获取dw链接前缀
    getDwUrlPrefix() {
        return this.http.get(`/marketing-api/campaign/campaigns/dwserver`).pipe(
            catchError(this.handleError)
        );
    }

    getContentDataTmpTrue(params: any) {
        let configUrl: any = `/marketing-api/campaign/campaigns`;
        const quertParams = this.getParams(params);
        configUrl = configUrl + quertParams;
        return this.http.get(configUrl).pipe(
            catchError(this.handleError)
        );
    }

    getContentData_formatActivityTime($data: any) {
        switch ($data.type) {
            case 1 :
                return $data.startTime ? $data.startTime.substring(0, 16) : '';
            case 2 :
                return ($data.startTime ? $data.startTime.substring(0, 10) : '')
                    + ' ~ '
                    + ($data.endTime ? $data.endTime.substring(0, 10) : '');
        }
    }

    setContentDeleteTrue(id: any) {
        return this.http.delete(`/marketing-api/campaign/campaigns/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 创建单触点应用
     */
    getSingleContactLaunch_launchCrowdSelect($success: any) {
        $success(
            [
                {
                    label: '请选择',
                    value: '请选择'
                }
            ]
        );
    }

    getSingleContactLaunch_launchWaysRadio($success: any) {
        $success(
            [
                {
                    icon: 'iconfont icon-Application-push',
                    text: '应用推送',
                    value: 1
                },
                {
                    icon: 'iconfont icon-chat',
                    text: '短信通知',
                    value: 2
                },
                {
                    icon: 'iconfont icon-markunread',
                    text: '邮件投放',
                    value: 3
                },
                {
                    icon: 'iconfont icon-wechat',
                    text: '公众号群发',
                    value: 4
                }
            ]
        );
    }

    // 查询字典
    getSegmentByCampaignId(campaignId: any) {
        const configUrl: any = '/marketing-api/campaign/segments/' + campaignId;
        return this.http.post(configUrl, {});
    }

    download(body: any) {
        let url = `/marketing-api/campaign/campaigns/download`;
        let param = this.getParams(body);
        url += param;
        return this.http.get(url).pipe(catchError(this.handleError));
    }
}
