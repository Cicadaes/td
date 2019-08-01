import {BaseModel} from "../base.model";

export class FunnelStepConditionDefinitionModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 漏斗ID */
    funnelStepDefinitionId: number;
    /** 事件Key */
    key: string;
    /** 操作符号 */
    operator: number;
    /** 事件value */
    value: string;
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
