import {BaseModel} from "../base.model";

export class FunnelIndexDefinitionModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 事件名称 */
    name: string;
    /** 事件ID */
    eventId: string;
    /** 用户管家传递id值 */
    indexId: number;
    /** 用户管家传递code值 */
    indexCode: string;
    /** 类型 1、Analytics  2、企业第一方数据 */
    type: number;
    /** 描述 */
    description: string;
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

}
