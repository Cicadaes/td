import {BaseModel} from "../base.model";

export class CampaignLaunchUnitModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动名称 */
    campaignId: number;
    /** 人群ID */
    crowdId: number;
    /** 人群名称 */
    crowdName: string;
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
