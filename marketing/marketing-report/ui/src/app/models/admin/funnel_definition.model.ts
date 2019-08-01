import {BaseModel} from "../base.model";

export class FunnelDefinitionModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 名称 */
    name: string;
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
