import { Injectable } from '@angular/core';
import { CampaignResourceService } from '../campaign/campaign.resource.service';
import { PipelineDefinitionResourceService } from '../admin/pipeline-definition.resource.service';
import { Subject } from 'rxjs';

@Injectable()
export class AllDetailDataCommunication {
    flag: boolean = true; //判断是否发起获取campaign数据请求

    //该service 用于存放活动详情、pipeLine详情数据
    campaignId: number; //营销活动ID
    private _campaignData: any = {}; //营销活动详情 key为campaignId，value为数据
    /**
     * 写入营销活动详情
     */
    set campaignData(data: any) {
        let that = this;
        that._campaignData[that.campaignId] = data;
    }

    /**
     * 获取营销活动详情
     * 根据campaignID获取 如果没有则去请求
     * TODO 错误处理未完成
     */
    get campaignData(): any {
        let that = this;
        let data = that._campaignData[that.campaignId];
        if (!that.campaignId) {
            return data;
        }
        if (!data) {
            that.getCampaignData();
            return '';
        } else {
            return that._campaignData[that.campaignId];
        }
    }
    pipeLineData: any = {};    //pipeLine详情数据

    // 新建投放里面A/B测试时 用于不同message之间的交互
    private GetCampaign = new Subject<any>();

    GetCampaign$ = this.GetCampaign.asObservable();
 
    getCampaignMission(data: any) {
        this.GetCampaign.next(data);
    }

    constructor(
        public campaignResourceService: CampaignResourceService,
        public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
    ) {}

    getCampaignData() {
        let that = this;
        if (!that.flag) {
            return;
        }
        that.flag = false;
        that.campaignResourceService.get(that.campaignId).then((data: any) => {
            that._campaignData[that.campaignId] = data;
            that.getCampaignMission(that._campaignData[that.campaignId]);
            that.flag = true;
        }).catch((err: any) => {})
    }
}