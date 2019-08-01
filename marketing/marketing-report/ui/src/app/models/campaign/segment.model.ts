import {BaseModel} from "../base.model";

export class SegmentModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 活动ID */
    campaignId: number;
    /** 活动投放单元ID */
    campaignLaunchUnitId: number;
    /** 人群ID */
    crowdId: number;
    /** 渠道定义ID */
    channelDefinitionId: number;
    /** 名称 */
    name: string;
    /** 状态 */
    status: number;
    /** 运行规则 */
    cron: string;
    /** 标题 */
    title: string;
    /** 消息 */
    message: string;
    /** 消息参 */
    messageParam: string;
    /** 渠道参数 */
    channelParam: string;
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
    /** 发送时间 */
    sendTime: Date;
    /** 发送类型：1：立即发送，2：定时发送，3：按天循环 4：按周循环 5：按月循环 */
    sendType: number;

}
