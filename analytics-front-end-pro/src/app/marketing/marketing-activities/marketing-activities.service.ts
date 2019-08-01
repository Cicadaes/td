import {Injectable, Injector} from '@angular/core';
import {CurdService} from '../../curd.service';

@Injectable()
export class MarketingActivitiesService extends CurdService {

    constructor(private injector: Injector) {
        super(injector);
    }

    // 根据id查询活动详情
    getCampaignById(campaignId: any) {
        const configUrl: any = '/marketing-api/campaign/campaigns/' + campaignId;
        return this.http.get(configUrl);
    }

    // 保存活动
    updateCampaigns(body: any) {
        const configUrl: any = '/marketing-api/campaign/campaigns';
        return this.http.put(configUrl, body);
    }

    // 保存活动名称和详情
    updateCampaignsSimple(body: any) {
        const configUrl: any = '/marketing-api/campaign/campaigns/updateCampaignNameAndDesc';
        return this.http.put(configUrl, body);
    }

    // =================全局管控===============

    // 根据id查询全局管控
    getGlobalControlByCampaignId(campaignId: any) {
        const configUrl: any = '/marketing-api/campaign/campaignGlobalcontrols/campaignId/' + campaignId;
        return this.http.get(configUrl);
    }

    //查询可设置的全局管控选项列表
    getGlobalControlOptions() {
        const configUrl: any = '/marketing-api/campaign/campaignGlobalcontrols/options';
        return this.http.get(configUrl);
    }

    // 更新全局管控信息
    updateGlobalcontrols(body: any) {
        const configUrl: any = '/marketing-api/campaign/campaignGlobalcontrols';
        return this.http.put(configUrl, body);
    }

    // =================计划目标===============
    // 计划目标配置-列表
    targetConfigs() {
        const configUrl: any = '/marketing-api/config/targetConfigs/scope/3?status=0';
        return this.http.get(configUrl);
    }

    // 计划目标配置-列表 （回显）
    targetConfigsEcho(codeList: string[]) {
        const configUrl: any = '/marketing-api/config/targetConfigs/scope/3/echo?status=0&targetCode=' + codeList;
        return this.http.get(configUrl);
    }

    // 根据活动ID查询计划目标列表
    getCampaignTargets(campaignId: any) {
        const configUrl: any = '/marketing-api/campaign/campaignTargets?campaignId=' + campaignId;
        return this.http.get(configUrl);
    }

    // 根据活动ID编辑全局管控信息
    createCampaignTargets(body: any) {
        const configUrl: any = '/marketing-api/campaign/campaignTargets';
        return this.http.post(configUrl, body);
    }

    // 根据活动ID和计划目标配置ID编辑单条计划目标
    updateCampaignTargets(body: any) {
        const configUrl: any = '/marketing-api/campaign/campaignTargets';
        return this.http.put(configUrl, body);
    }

    // 根据主键ID删除活动计划目标
    deleteCampaignTargets(targetId: any) {
        const configUrl: any = '/marketing-api/campaign/campaignTargets/' + targetId;
        return this.http.delete(configUrl);
    }

    // =================权益配置===============

    // 根据活动ID查询权益配置列表
    findEquityByCampaignId(campaignId) {
        const configUrl: any = '/marketing-api/campaign/equitys/findByCampaignId/' + campaignId;
        return this.http.get(configUrl);
    }

    // 权益配置_新建权益配置
    createEquity(body: any) {
        const configUrl: any = '/marketing-api/campaign/equityConfigs?uploadUUID=' + body.uploadUUID
            + '&name=' + body.name + '&total=' + body.total + '&campaignId=' + body.campaignId;
        return this.http.post(configUrl, {});
    }

    // 权益配置_更新
    updateEquity(body: any) {
        let configUrl: any = '/marketing-api/campaign/equityConfigs/' + body.equityConfigId
            + '?name=' + body.name;
        if (body.uploadUUID && body.total) {
            configUrl += '&total=' + body.total + '&uploadUUID=' + body.uploadUUID;
        }
        return this.http.post(configUrl, body);
    }

    // 根据权益配置ID删除权益配置
    deleteEquity(id: any) {
        const configUrl: any = '/marketing-api/campaign/equityConfigs/' + id;
        return this.http.delete(configUrl);
    }

    // 权益配置_查询权益配置总数
    getEquityAmount(uuid: any) {
        const body = {
            uploadUUID: uuid
        };
        const configUrl: any = '/marketing-api/campaign/equitys/amount';
        return this.http.post(configUrl, body);
    }

    // =================pipeline===============
    //查询pipeline列表
    getPipelineList(campaignId: any) {
        const configUrl: any = '/marketing-api/campaign/pipelines/campaignId/' + campaignId;
        return this.http.get(configUrl);
    }

    // 营销流程_新建
    createPipeline(campaignId: any) {
        const body = {
            'version': '1.0',
            'campaignId': campaignId,
            'diagram': '{\"nodeDefinitionList\":[],\"edgeDefinitionList\":[]}',
            'status': 1
        };
        const configUrl: any = '/marketing-api/campaign/pipelines/create';
        return this.http.post(configUrl, body);
    }

    // 营销流程_更新
    updateBak(id: any, name: any) {
        const body = {};
        const configUrl: any = '/marketing-api/campaign/pipelines/savePipelineName/' + id + '?pipelineName=' + name;
        return this.http.post(configUrl, body);
    }

    // 更新pipeline权益配置
    updatePipelineEquity(body: any) {
        const configUrl: any = '/marketing-api/campaign/pipelineEquitys';
        return this.http.put(configUrl, body);
    }

    // 根据主键ID删除Pipeline
    deletePipeline(id: any) {
        const configUrl: any = '/marketing-api/campaign/pipelines/' + id;
        return this.http.delete(configUrl);
    }
}
