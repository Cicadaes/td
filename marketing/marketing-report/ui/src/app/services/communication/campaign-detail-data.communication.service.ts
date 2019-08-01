import { Injectable } from '@angular/core';

@Injectable()
export class CampaignDetailDataCommunication {
    //该service 用于营销活动详情页组件之间数据通信

    public campaignId: number;  //活动Id

    public isFinish: boolean = true; //活动是否结束

    public campaignStatus: number; // 营销活动状态 1 等待开始   2  进行中   3   已结束

    public campaignData: any = {};   //活动详情

    public campaignTargetConfig: any = {}; //计划目标数据

    public campaignLaunchUnits: any = {}; //投放单元

    public userRight: string; // 用户的权限

    constructor() {}
}