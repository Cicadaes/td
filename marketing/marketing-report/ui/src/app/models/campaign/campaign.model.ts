import {BaseModel} from "../base.model";

export class CampaignModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 名称 */
    name: string;
    /** 开始时间 */
    startTime: Date;
    /** 结束时间 */
    endTime: Date;
    /** 状态 -1、已删除 0、等待开始 1、进行中 2、结束 */
    status: number;
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
