import {BaseModel} from "../base.model";

export class CampaignTargetConfigModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动ID */
    campaignId: number;
    /** 目标定义ID */
    targetDefinitionId: number;
    /** 名称 */
    name: string;
    /** 值 */
    value: string;
    /** 类型1.累计到达；2.结束到达 */
    metricType: number;
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
