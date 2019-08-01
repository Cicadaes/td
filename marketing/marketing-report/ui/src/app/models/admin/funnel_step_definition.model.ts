import {BaseModel} from "../base.model";

export class FunnelStepDefinitionModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 漏斗ID */
    funnelDefinitionId: number;
    /** 名称 */
    name: string;
    /** 类型 1、Analytics  2、企业第一方数据 */
    type: number;
    /** 租户ID */
    tenantId: string;
    /**  */
    order: number;
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
