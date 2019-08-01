import {BaseModel} from "../base.model";

export class CrowdModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动ID */
    campaignId: number;
    /** 人群类型(looklike scene accurate) */
    crowdType: number;
    /** 来源(用户管家) */
    source: number;
    /** 父人群ID */
    parentId: number;
    /** 引用ID */
    refId: number;
    /** 人群最后更新时间 */
    lastUpdateTime: Date;
    /** 人群状态 */
    status: number;
    /** 起始时间 */
    startTime: Date;
    /** 结束时间 */
    endTime: Date;
    /** 预估数量 */
    estimatedSize: number;
    /** Push预估数量 */
    pushEstimatedSize: number;
    /** 短信预估数量 */
    smsEstimatedSize: number;
    /** 广告预估数量 */
    adEstimatedSize: number;
    /** 引用编码 */
    refCode: string;
    /** 引用名称 */
    refName: string;
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
