import {BaseModel} from "./../base.model";

export class SchedulerTaskLogModel extends BaseModel{

    /** 唯一标识 */
    id: number;
    /** 任务id */
    taskId: number;
    /** 任务编码 */
    taskCode: string;
    /** azkaban项目名称 */
    azkabanProjectName: string;
    /** azkaban执行id */
    azkabanExecutorId: number;
    /** 开始时间 */
    startTime: Date;
    /** 结束时间 */
    endTime: Date;
    /** 状态: 0，未计算 1，计算中 2,计算完成  4, 被终止 5,无需执行 -1,计算异常 -2，计算超时 -3，待计算 -4，重新计算 */
    status: number;
    /** 初始参数 */
    inputParam: string;
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
    /** 数据应用id */
    dataAppId: string;
    /** 租户id */
    tenantId: string;
    /** 关联的调度任务ID，管理员重试发起的调度任务，用来保存原始的调度任务ID */
    refSchedulerTaskLogId: number;
    /** 异常信息 */
    execptionInfo: string;
    /** 调度任务日志重试次数 */
    retryNum: number;
    /** 任务摘要 */
    taskSummary: string;
    /** 任务名称 */
    taskName:string

}
