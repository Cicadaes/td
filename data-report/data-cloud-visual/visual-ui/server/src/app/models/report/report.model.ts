import {BaseModel} from "./../base.model";

export class SchedulerTaskModel extends BaseModel{

    /** 唯一标识 */
    id: number;
    /** 名称 */
    name: string;
    /** 编码 */
    code: string;
    /** azkaban工程名称 */
    azkabanProjectName: string;
    /** azkaban工程id */
    azkabanProjectId: number;
    /** azkaban工程版本 */
    azkabanProjectVersion: number;
    /** azkaban job flow id */
    azkabanJobFlowId: string;
    /** job flow类型 0,单个任务 1总任务 */
    azkabanJobFlowVersion: number;
    /** 状态,0 禁用 1 正常 */
    status: number;
    /** 创建人账号 */
    createBy: string;
    /** 创建人 */
    creator: string;
    /** 修改人账号 */
    updateBy: string;
    /** 创建时间 */
    createTime: Date;
    /** 修改时间 */
    updateTime: Date;
    /** 发布时间 */
    publishTime: Date;
    /** 数据应用id */
    dataAppId: string;
    /** 租户id:系统任务(system),跨租户任务(all),租户任务(tenantId) */
    tenantId: string;
    /** 所属系统编码 */
    systemCode: string;
    /** 描述 */
    description: string;

}
