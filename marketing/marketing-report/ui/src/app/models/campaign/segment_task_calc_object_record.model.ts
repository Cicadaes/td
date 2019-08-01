import {BaseModel} from "../base.model";

export class SegmentTaskCalcObjectRecordModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动ID */
    campaignId: number;
    /** 投放单元ID */
    campaignLaunchUnitId: number;
    /** 投放ID */
    segmentId: number;
    /** 渠道定义ID */
    channelDefinitionId: number;
    /** 状态-1、异常 0、未开始 1、进行中 2、已完成 */
    status: number;
    /** 计算信息 */
    calcInfo: string;
    /** 开始时间 */
    startTime: Date;
    /** 结束时间 */
    finishTime: Date;
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
    /** 最后更新时间 */
    updateTime: Date;
    /** 扩展字段:记录pushId */
    attr1: string;

}
