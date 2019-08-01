import {BaseModel} from "../base.model";

export class CampaignFunnelConfigModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动ID */
    campaignId: number;
    /** 漏斗ID */
    funnelId: number;
    /** 漏斗名称 */
    funnelName: string;
    /** 是否默认：0-否，1-是 */
    defaultFlag: number;
    /** 租户ID */
    tenantId: string;
    /** 创建人 */
    creator: string;
    /** 创建人账号 */
    createBy: string;
    /** 创建时间 */
    createTime: Date;
    /** 更新人 */
    updater: string;
    /** 更新人账号 */
    updateBy: string;
    /** 最后更新时间 */
    updateTime: Date;

}
