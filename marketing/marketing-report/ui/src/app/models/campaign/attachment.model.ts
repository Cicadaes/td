import {BaseModel} from "../base.model";

export class AttachmentModel extends BaseModel{

    /** 主键 */
    id: number;
    /** 人群ID */
    crowdId: number;
    /** 上传文件名称 */
    name: string;
    /** 路径 */
    path: string;
    /** 二进制文件 */
    data: any;
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
    updaterBy: string;
    /** 最后更新时间 */
    updateTime: Date;

}
