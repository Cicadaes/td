import {BaseModel} from "../base.model";

export class EquityConfigModel extends BaseModel{

    /**  */
    id: number;
    /** 活动id */
    campaignId: number;
    /** 权益名称 */
    name: string;
    /** 总量 */
    total: number;
    /** 附件id */
    attachmentId: number;
    /** 租户ID */
    tenantId: string;
    /** 创建人 */
    creator: string;
    /** 创建时间 */
    createTime: Date;
    /** 更新人 */
    updater: string;
    /** 更新人账号 */
    updaterBy: string;
    /** 最后更新时间 */
    updateTime: Date;
    /** 创建人账号 */
    createBy: string;

}
