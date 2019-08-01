import {BaseModel} from "../base.model";

export class EffectIndexDefinitionModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 名称 */
    name: string;
    /** 指标ID */
    indexId: number;
    /** 指标code,具体见类EffectIndexCode */
    indexCode: number;
    /** 描述 */
    description: string;
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
    /** 更新时间 */
    updateTime: Date;

}
