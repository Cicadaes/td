import {BaseModel} from "../base.model";

export class SegmentTaskCalcObjectRecordMetricModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动ID */
    campaignId: number;
    /** 活动单元ID */
    campaignLaunchUnitId: number;
    /** 投放ID */
    segmentId: number;
    /** 渠道ID */
    channelDefinitionId: number;
    /** 计算对象ID */
    calcObjectId: number;
    /** 日期 */
    date: string;
    /** 度量的Key */
    metricKey: string;
    /** 度量的值 */
    metricValue: string;
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
