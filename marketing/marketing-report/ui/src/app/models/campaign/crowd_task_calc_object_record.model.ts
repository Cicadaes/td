import {BaseModel} from "../base.model";

export class CrowdTaskCalcObjectRecordModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 人群id */
    crowdId: number;
    /** 人群名称 */
    crowdName: string;
    /** 人群类型(1.Lookalike人群  2.场景人群  3.精准人群(历史人群) 4.精准人群(本地文件上） 5.子人群) */
    crowdType: number;
    /** 状态 －1.异常 0.未开始 1.进行中 2.已完成 */
    status: number;
    /** 开始时间 */
    startTime: Date;
    /** 结束时间 */
    finishTime: Date;
    /** 租户ID */
    tenantId: string;
    /** 创建人 */
    creator: string;
    /** 创建人账户 */
    createBy: string;
    /** 创建时间 */
    createTime: Date;
    /** 更新人 */
    updater: string;
    /** 更新人账户 */
    updateBy: string;
    /** 最后更新时间 */
    updateTime: Date;
    /** 引用ID */
    refId: number;
    /** 重试次数 */
    retry: number;
    /** 最大重试次 */
    maxRetry: number;

}
