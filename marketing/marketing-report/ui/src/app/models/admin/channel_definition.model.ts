import {BaseModel} from "../base.model";

export class CampaignTargetDefinitionModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 名称 */
    name: string;
    /** 值 */
    value: string;
    /** 指标ID */
    indexId: number;
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
